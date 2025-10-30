import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/conversations/[id]
 * Get a single conversation with all messages
 */
export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		const conversation = await prisma.conversation.findUnique({
			where: { id },
			select: {
				id: true,
				createdAt: true,
				updatedAt: true,
				userAId: true,
				userBId: true,
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
						createdAt: "asc",
					},
					select: {
						id: true,
						content: true,
						createdAt: true,
						senderId: true,
						isRead: true,
						readAt: true,
					},
				},
			},
		});

		if (!conversation) {
			return NextResponse.json(
				{ error: "Conversation not found" },
				{ status: 404 },
			);
		}

		// Verify user is part of the conversation
		const userId = session.user.id;
		if (conversation.userAId !== userId && conversation.userBId !== userId) {
			return NextResponse.json(
				{ error: "You are not part of this conversation" },
				{ status: 403 },
			);
		}

		// Get the other user
		const otherUser =
			conversation.userA.id === userId
				? conversation.userB
				: conversation.userA;

		return NextResponse.json({
			id: conversation.id,
			createdAt: conversation.createdAt,
			updatedAt: conversation.updatedAt,
			user: otherUser,
			messages: conversation.messages,
		});
	} catch (error) {
		console.error("Error fetching conversation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
