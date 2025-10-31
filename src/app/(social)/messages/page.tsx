"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/app/ui/components/empty-state";
import { ErrorState } from "@/app/ui/components/error-state";
import { LoadingState } from "@/app/ui/components/loading-state";
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
		return <LoadingState />;
	}

	if (error) {
		return (
			<main className="container mx-auto max-w-3xl px-4 py-8">
				<ErrorState title="Error loading conversations" description={error} />
			</main>
		);
	}

	return (
		<main className="container mx-auto max-w-3xl py-8">
			<div className="mb-6">
				<h1 className="mb-2 font-bold text-3xl">Messages</h1>
				<p className="text-foreground-500">
					{conversations.length === 0
						? "No conversations yet"
						: `${conversations.length} conversation${conversations.length === 1 ? "" : "s"}`}
				</p>
			</div>

			{conversations.length === 0 ? (
				<EmptyState
					title="No messages yet"
					description="Start swiping and matching with other developers to begin conversations!"
				/>
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
