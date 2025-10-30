import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/conversations
 * Get all conversations for the current user
 */
export async function GET(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
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
 */
export async function POST(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { matchId } = body;

		if (!matchId || typeof matchId !== "string") {
			return NextResponse.json(
				{ error: "matchId is required" },
				{ status: 400 },
			);
		}

		// Verify the match exists and the user is part of it
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

		// Create conversation (upsert to handle existing conversations)
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

		return NextResponse.json(conversation, { status: 201 });
	} catch (error) {
		console.error("Error creating conversation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
