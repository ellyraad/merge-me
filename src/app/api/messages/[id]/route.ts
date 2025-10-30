import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/messages/[id]
 * Mark a message as read
 */
export async function PATCH(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		// Get message with conversation details
		const message = await prisma.message.findUnique({
			where: { id },
			select: {
				id: true,
				senderId: true,
				isRead: true,
				conversation: {
					select: {
						userAId: true,
						userBId: true,
					},
				},
			},
		});

		if (!message) {
			return NextResponse.json({ error: "Message not found" }, { status: 404 });
		}

		// Verify user is part of conversation
		const userId = session.user.id;
		if (
			message.conversation.userAId !== userId &&
			message.conversation.userBId !== userId
		) {
			return NextResponse.json(
				{ error: "You are not part of this conversation" },
				{ status: 403 },
			);
		}

		// Can only mark messages sent by others as read
		if (message.senderId === userId) {
			return NextResponse.json(
				{ error: "Cannot mark your own message as read" },
				{ status: 400 },
			);
		}

		// Update message
		const updatedMessage = await prisma.message.update({
			where: { id },
			data: {
				isRead: true,
				readAt: new Date(),
			},
			select: {
				id: true,
				content: true,
				createdAt: true,
				senderId: true,
				isRead: true,
				readAt: true,
			},
		});

		return NextResponse.json(updatedMessage);
	} catch (error) {
		console.error("Error marking message as read:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
