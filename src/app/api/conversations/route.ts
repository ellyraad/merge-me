import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/conversations
 * Get all conversations for the current user
 * Query params:
 * - limit: number (default 50)
 * - offset: number (default 0)
 * - userId: string (optional) - check if conversation exists with this user
 */
export async function GET(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const otherUserId = searchParams.get("userId");

		// check for existing convo
		if (otherUserId) {
			const conversation = await prisma.conversation.findFirst({
				where: {
					OR: [
						{ userAId: session.user.id, userBId: otherUserId },
						{ userAId: otherUserId, userBId: session.user.id },
					],
				},
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					matchId: true,
					messages: {
						select: {
							id: true,
						},
						take: 1,
					},
				},
			});

			return NextResponse.json({
				exists: !!conversation,
				conversation: conversation || null,
				hasMessages: conversation ? conversation.messages.length > 0 : false,
			});
		}

		const limit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
		const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);

		const userId = session.user.id;

		const [conversations, total] = await Promise.all([
			prisma.conversation.findMany({
				where: {
					OR: [{ userAId: userId }, { userBId: userId }],
				},
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					userA: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							photo: {
								select: {
									url: true,
								},
							},
						},
					},
					userB: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							photo: {
								select: {
									url: true,
								},
							},
						},
					},
					messages: {
						orderBy: {
							createdAt: "desc",
						},
						take: 1,
						select: {
							id: true,
							content: true,
							createdAt: true,
							senderId: true,
							isRead: true,
						},
					},
					_count: {
						select: {
							messages: {
								where: {
									senderId: {
										not: userId,
									},
									isRead: false,
								},
							},
						},
					},
				},
				orderBy: {
					updatedAt: "desc",
				},
				take: limit,
				skip: offset,
			}),
			prisma.conversation.count({
				where: {
					OR: [{ userAId: userId }, { userBId: userId }],
				},
			}),
		]);

		// Transform to include the other user
		const transformedConversations = conversations.map(conversation => {
			const otherUser =
				conversation.userA.id === userId
					? conversation.userB
					: conversation.userA;

			return {
				id: conversation.id,
				createdAt: conversation.createdAt,
				updatedAt: conversation.updatedAt,
				user: otherUser,
				lastMessage: conversation.messages[0] || null,
				unreadCount: conversation._count.messages,
			};
		});

		return NextResponse.json({
			conversations: transformedConversations,
			total,
			limit,
			offset,
		});
	} catch (error) {
		console.error("Error fetching conversations:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/conversations
 * Create a new conversation (only if a match exists)
 * Optionally send initial message with { matchId, initialMessage }
 */
export async function POST(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { matchId, initialMessage } = body;

		if (!matchId || typeof matchId !== "string") {
			return NextResponse.json(
				{ error: "matchId is required" },
				{ status: 400 },
			);
		}

		const match = await prisma.match.findUnique({
			where: { id: matchId },
		});

		if (!match) {
			return NextResponse.json({ error: "Match not found" }, { status: 404 });
		}

		const userId = session.user.id;
		if (match.userAId !== userId && match.userBId !== userId) {
			return NextResponse.json(
				{ error: "You are not part of this match" },
				{ status: 403 },
			);
		}

		const conversation = await prisma.conversation.upsert({
			where: {
				userAId_userBId: {
					userAId: match.userAId,
					userBId: match.userBId,
				},
			},
			create: {
				userAId: match.userAId,
				userBId: match.userBId,
				matchId: match.id,
			},
			update: {},
			select: {
				id: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (
			initialMessage &&
			typeof initialMessage === "string" &&
			initialMessage.trim()
		) {
			await Promise.all([
				prisma.message.create({
					data: {
						conversationId: conversation.id,
						senderId: userId,
						content: initialMessage.trim(),
					},
				}),
				prisma.conversation.update({
					where: { id: conversation.id },
					data: { updatedAt: new Date() },
				}),
			]);
		}

		return NextResponse.json(conversation, { status: 201 });
	} catch (error) {
		console.error("Error creating conversation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
