"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import type { ConversationDetail } from "@/lib/types";

export default function ConversationPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const [conversation, setConversation] = useState<ConversationDetail | null>(
		null,
	);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const userResponse = await fetch("/api/users");
				if (userResponse.ok) {
					const userData = await userResponse.json();
					setCurrentUserId(userData.id);
				}

				const response = await fetch(`/api/conversations/${id}`, {
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch conversation");
				}

				const data = await response.json();
				setConversation(data);

				setTimeout(() => {
					messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
				}, 100);
			} catch (err) {
				console.error("Error fetching conversation:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load conversation",
				);
			} finally {
				setIsLoading(false);
			}
		}

		if (id) {
			fetchData();
		}
	}, [id]);

	// Scroll to bottom when messages change
	useEffect(() => {
		if (conversation?.messages) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [conversation?.messages]);

	const handleSendMessage = async () => {
		if (!(message.trim() && conversation)) {
			return;
		}

		try {
			setIsSending(true);
			const response = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					conversationId: conversation.id,
					content: message.trim(),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			const newMessage = await response.json();

			setConversation(prev => {
				if (!prev) {
					return prev;
				}
				return {
					...prev,
					messages: [...prev.messages, newMessage],
				};
			});

			setMessage("");
		} catch (err) {
			console.error("Error sending message:", err);
		} finally {
			setIsSending(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	if (isLoading) {
		return (
			<main className="container mx-auto flex max-w-4xl items-center justify-center px-4 py-8">
				<Spinner size="lg" />
			</main>
		);
	}

	if (error || !conversation) {
		return (
			<main className="container mx-auto max-w-4xl px-4 py-8">
				<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-danger border-dashed py-16">
					<p className="text-danger text-xl">Error loading conversation</p>
					<p className="text-foreground-400 text-sm">{error}</p>
					<Button color="primary" onPress={() => router.push("/messages")}>
						Back to Messages
					</Button>
				</div>
			</main>
		);
	}

	const otherUser = conversation.user;
	const fullName = `${otherUser.firstName} ${otherUser.lastName}`;

	return (
		<main className="flex h-full max-w-4xl flex-col px-4 py-8">
			<div className="flex shrink-0 items-center justify-between gap-3 border-gray-700 border-b-1 pb-5">
				<div className="flex items-center gap-4">
					<Avatar src={otherUser.photo?.url} size="md" />

					<div>
						<Link href={`/user/${otherUser.id}`} className="font-bold text-lg">
							{fullName}
						</Link>
					</div>
				</div>
			</div>

			<div className="my-4 min-h-0 flex-1 overflow-y-auto">
				{conversation.messages.length === 0 ? (
					<div className="flex h-full items-center justify-center">
						<p className="text-foreground-400">No messages yet</p>
					</div>
				) : (
					<div className="flex flex-col gap-3 pb-4">
						{conversation.messages.map(msg => {
							const isOwn = msg.senderId === currentUserId;
							return (
								<div
									key={msg.id}
									className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-[70%] rounded-lg px-4 py-2 ${
											isOwn
												? "bg-green-600 text-white"
												: "bg-gray-700 text-white"
										}`}
									>
										<p className="wrap-break-words">{msg.content}</p>
										<p className="mt-1 text-xs opacity-70">
											{new Date(msg.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
								</div>
							);
						})}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			<Divider className="shrink-0" />

			<div className="flex shrink-0 flex-col gap-2 py-4">
				<Textarea
					variant="bordered"
					placeholder="Type a message..."
					value={message}
					onValueChange={setMessage}
					onKeyDown={handleKeyPress}
					isDisabled={isSending}
					size="lg"
					radius="sm"
				/>

				<div className="flex w-full justify-end">
					<Button
						onPress={handleSendMessage}
						isLoading={isSending}
						isDisabled={!message.trim() || isSending}
						size="md"
						radius="sm"
						className="bg-gh-green-300 text-white dark:text-foreground"
					>
						{!isSending && <FaPaperPlane />} Send
					</Button>
				</div>
			</div>
		</main>
	);
}
