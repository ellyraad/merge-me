export type Message = {
	id: string;
	content: string;
	createdAt: string;
	senderId: string;
	isRead: boolean;
	readAt: string | null;
};

export type LastMessage = Omit<Message, "readAt">;
