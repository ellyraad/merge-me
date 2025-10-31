import type { LastMessage, Message } from "./message.types";
import type { ConversationUser } from "./user.types";

export type ConversationDetail = {
	id: string;
	createdAt: string;
	updatedAt: string;
	user: ConversationUser;
	messages: Message[];
};

export type ConversationListItem = {
	id: string;
	user: ConversationUser;
	lastMessage: LastMessage | null;
	unreadCount: number;
};
