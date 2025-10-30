"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

interface Message {
	id: string;
	content: string;
	createdAt: string;
	senderId: string;
	isRead: boolean;
	readAt: string | null;
}

interface ConversationUser {
	id: string;
	firstName: string;
	lastName: string;
	photo: {
		url: string;
	} | null;
}

interface ConversationData {
	id: string;
	createdAt: string;
	updatedAt: string;
	user: ConversationUser;
	messages: Message[];
}

export default function ConversationPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const [conversation, setConversation] = useState<ConversationData | null>(
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
				// Fetch current user
				const userResponse = await fetch("/api/users");
				if (userResponse.ok) {
					const userData = await userResponse.json();
					setCurrentUserId(userData.id);
				}

				// Fetch conversation
				const response = await fetch(`/api/conversations/${id}`, {
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch conversation");
				}

				const data = await response.json();
				setConversation(data);

				// Scroll to bottom after loading messages
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

			// Update conversation with new message
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
		<main className="container mx-auto flex max-w-4xl flex-col px-4 py-8">
			<Card className="flex h-[calc(100vh-200px)] flex-col">
				<CardHeader className="flex gap-3 border-divider border-b">
					<div className="flex flex-col">
						<p className="font-bold text-lg">{fullName}</p>
					</div>
				</CardHeader>

				<Divider />

				<CardBody className="flex-1 overflow-y-auto">
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
				</CardBody>

				<Divider />

				<div className="flex gap-2 p-4">
					<Input
						placeholder="Type a message..."
						value={message}
						onValueChange={setMessage}
						onKeyDown={handleKeyPress}
						isDisabled={isSending}
						size="lg"
					/>
					<Button
						color="success"
						onPress={handleSendMessage}
						isLoading={isSending}
						isDisabled={!message.trim() || isSending}
						isIconOnly
						size="lg"
					>
						{!isSending && <FaPaperPlane />}
					</Button>
				</div>
			</Card>
		</main>
	);
}
