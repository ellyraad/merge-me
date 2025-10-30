import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaginationParams, ServiceResult } from "./types";
import { error, success } from "./types";

const conversationDetailSelect = {
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
} satisfies Prisma.ConversationSelect;

export interface GetConversationsParams extends PaginationParams {
	userId: string;
}

export interface CheckConversationParams {
	currentUserId: string;
	otherUserId: string;
}

export interface CreateConversationParams {
	matchId: string;
	currentUserId: string;
	initialMessage?: string;
}

export interface GetConversationParams {
	conversationId: string;
	currentUserId: string;
}

/**
 * Check if conversation exists between two users
 */
export async function checkConversationExists({
	currentUserId,
	otherUserId,
}: CheckConversationParams): Promise<ServiceResult<unknown>> {
	try {
		const conversation = await prisma.conversation.findFirst({
			where: {
				OR: [
					{ userAId: currentUserId, userBId: otherUserId },
					{ userAId: otherUserId, userBId: currentUserId },
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

		return success({
			exists: !!conversation,
			conversation: conversation || null,
			hasMessages: conversation ? conversation.messages.length > 0 : false,
		});
	} catch (err) {
		return error("INTERNAL", "Failed to check conversation", err);
	}
}

/**
 * Get all conversations for a user with pagination
 */
export async function getConversations({
	userId,
	limit = 50,
	offset = 0,
}: GetConversationsParams): Promise<ServiceResult<unknown>> {
	try {
		const [conversations, total] = await Promise.all([
			prisma.conversation.findMany({
				where: {
					OR: [{ userAId: userId }, { userBId: userId }],
				},
				select: {
					...conversationDetailSelect,
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

		return success({
			conversations: transformedConversations,
			total,
			limit,
			offset,
		});
	} catch (err) {
		return error("INTERNAL", "Failed to fetch conversations", err);
	}
}

/**
 * Get a single conversation by ID
 */
export async function getConversationById({
	conversationId,
	currentUserId,
}: GetConversationParams): Promise<ServiceResult<unknown>> {
	try {
		const conversation = await prisma.conversation.findUnique({
			where: { id: conversationId },
			select: {
				...conversationDetailSelect,
				userAId: true,
				userBId: true,
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
			return error("NOT_FOUND", "Conversation not found");
		}

		if (
			conversation.userAId !== currentUserId &&
			conversation.userBId !== currentUserId
		) {
			return error("FORBIDDEN", "You are not part of this conversation");
		}

		const otherUser =
			conversation.userA.id === currentUserId
				? conversation.userB
				: conversation.userA;

		return success({
			id: conversation.id,
			createdAt: conversation.createdAt,
			updatedAt: conversation.updatedAt,
			user: otherUser,
			messages: conversation.messages,
		});
	} catch (err) {
		return error("INTERNAL", "Failed to fetch conversation", err);
	}
}

/**
 * Create a new conversation from a match
 */
export async function createConversation({
	matchId,
	currentUserId,
	initialMessage,
}: CreateConversationParams): Promise<ServiceResult<unknown>> {
	try {
		const match = await prisma.match.findUnique({
			where: { id: matchId },
		});

		if (!match) {
			return error("NOT_FOUND", "Match not found");
		}

		if (match.userAId !== currentUserId && match.userBId !== currentUserId) {
			return error("FORBIDDEN", "You are not part of this match");
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
						senderId: currentUserId,
						content: initialMessage.trim(),
					},
				}),
				prisma.conversation.update({
					where: { id: conversation.id },
					data: { updatedAt: new Date() },
				}),
			]);
		}

		return success(conversation);
	} catch (err) {
		return error("INTERNAL", "Failed to create conversation", err);
	}
}
