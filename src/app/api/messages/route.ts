import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createMessageSchema } from "@/lib/schemas";

/**
 * POST /api/messages
 * Create a new message in a conversation
 */
export async function POST(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validated = createMessageSchema.safeParse(body);

		if (!validated.success) {
			return NextResponse.json(
				{ error: "Validation failed", issues: validated.error.issues },
				{ status: 400 },
			);
		}

		const { conversationId, content } = validated.data;

		// Verify conversation exists and user is part of it
		const conversation = await prisma.conversation.findUnique({
			where: { id: conversationId },
			select: {
				userAId: true,
				userBId: true,
			},
		});

		if (!conversation) {
			return NextResponse.json(
				{ error: "Conversation not found" },
				{ status: 404 },
			);
		}

		const userId = session.user.id;
		if (conversation.userAId !== userId && conversation.userBId !== userId) {
			return NextResponse.json(
				{ error: "You are not part of this conversation" },
				{ status: 403 },
			);
		}

		// Create message and update conversation timestamp
		const [message] = await Promise.all([
			prisma.message.create({
				data: {
					conversationId,
					senderId: userId,
					content,
				},
				select: {
					id: true,
					content: true,
					createdAt: true,
					senderId: true,
					isRead: true,
					readAt: true,
				},
			}),
			prisma.conversation.update({
				where: { id: conversationId },
				data: { updatedAt: new Date() },
			}),
		]);

		return NextResponse.json(message, { status: 201 });
	} catch (error) {
		console.error("Error creating message:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
