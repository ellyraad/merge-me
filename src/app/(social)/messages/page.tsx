"use client";

import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";
import { ConversationListItem } from "./components/conversation-list-item";

interface ConversationUser {
	id: string;
	firstName: string;
	lastName: string;
	photo: {
		url: string;
	} | null;
}

interface LastMessage {
	id: string;
	content: string;
	createdAt: string;
	senderId: string;
	isRead: boolean;
}

interface ConversationData {
	id: string;
	user: ConversationUser;
	lastMessage: LastMessage | null;
	unreadCount: number;
}

export default function MessagesPage() {
	const [conversations, setConversations] = useState<ConversationData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchConversations() {
			try {
				const response = await fetch("/api/conversations", {
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch conversations");
				}

				const data = await response.json();
				setConversations(data.conversations || []);
			} catch (err) {
				console.error("Error fetching conversations:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load conversations",
				);
			} finally {
				setIsLoading(false);
			}
		}

		fetchConversations();
	}, []);

	if (isLoading) {
		return (
			<main className="container mx-auto flex max-w-3xl items-center justify-center px-4 py-8">
				<Spinner size="lg" />
			</main>
		);
	}

	if (error) {
		return (
			<main className="container mx-auto max-w-3xl px-4 py-8">
				<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-danger border-dashed py-16">
					<p className="text-danger text-xl">Error loading conversations</p>
					<p className="text-foreground-400 text-sm">{error}</p>
				</div>
			</main>
		);
	}

	return (
		<main className="container mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6">
				<h1 className="mb-2 font-bold text-3xl">Messages</h1>
				<p className="text-foreground-500">
					{conversations.length === 0
						? "No conversations yet"
						: `${conversations.length} conversation${conversations.length === 1 ? "" : "s"}`}
				</p>
			</div>

			{conversations.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-foreground-200 border-dashed py-16">
					<p className="text-foreground-500 text-xl">No messages yet</p>
					<p className="max-w-md text-center text-foreground-400 text-sm">
						Start swiping and matching with other developers to begin
						conversations!
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{conversations.map(conversation => {
						const fullName = `${conversation.user.firstName} ${conversation.user.lastName}`;
						const imageUrl =
							conversation.user.photo?.url ||
							`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff`;

						return (
							<ConversationListItem
								key={conversation.id}
								conversationId={conversation.id}
								imageUrl={imageUrl}
								name={fullName}
								lastMessage={conversation.lastMessage?.content || null}
								lastMessageTime={
									conversation.lastMessage
										? new Date(conversation.lastMessage.createdAt)
										: undefined
								}
								unreadCount={conversation.unreadCount}
							/>
						);
					})}
				</div>
			)}
		</main>
	);
}
