import { prisma } from "@/lib/prisma";
import type { ServiceResult } from "./types";
import { error, success } from "./types";

export interface CreateMessageParams {
	conversationId: string;
	senderId: string;
	content: string;
}

export interface MarkMessageReadParams {
	messageId: string;
	currentUserId: string;
}

/**
 * Create a new message in a conversation
 */
export async function createMessage({
	conversationId,
	senderId,
	content,
}: CreateMessageParams): Promise<ServiceResult<unknown>> {
	try {
		// Verify conversation exists and user is part of it
		const conversation = await prisma.conversation.findUnique({
			where: { id: conversationId },
			select: {
				userAId: true,
				userBId: true,
			},
		});

		if (!conversation) {
			return error("NOT_FOUND", "Conversation not found");
		}

		if (
			conversation.userAId !== senderId &&
			conversation.userBId !== senderId
		) {
			return error("FORBIDDEN", "You are not part of this conversation");
		}

		// Create message and update conversation timestamp
		const [message] = await Promise.all([
			prisma.message.create({
				data: {
					conversationId,
					senderId,
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

		return success(message);
	} catch (err) {
		return error("INTERNAL", "Failed to create message", err);
	}
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead({
	messageId,
	currentUserId,
}: MarkMessageReadParams): Promise<ServiceResult<unknown>> {
	try {
		// Get message with conversation details
		const message = await prisma.message.findUnique({
			where: { id: messageId },
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
			return error("NOT_FOUND", "Message not found");
		}

		// Verify user is part of conversation
		if (
			message.conversation.userAId !== currentUserId &&
			message.conversation.userBId !== currentUserId
		) {
			return error("FORBIDDEN", "You are not part of this conversation");
		}

		// Can only mark messages sent by others as read
		if (message.senderId === currentUserId) {
			return error("VALIDATION", "Cannot mark your own message as read");
		}

		// Update message
		const updatedMessage = await prisma.message.update({
			where: { id: messageId },
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

		return success(updatedMessage);
	} catch (err) {
		return error("INTERNAL", "Failed to mark message as read", err);
	}
}
