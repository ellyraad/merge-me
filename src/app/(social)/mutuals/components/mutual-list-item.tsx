"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Tooltip } from "@heroui/tooltip";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DiGitMerge } from "react-icons/di";
import { FaComment } from "react-icons/fa";
import { HoverableCard } from "@/app/ui/components/hoverable-card";
import { MessageModal } from "@/app/ui/components/message-modal";
import { UserAvatar } from "@/app/ui/components/user-avatar";

export function MutualListItem({
	matchId,
	userId,
	imageUrl,
	name,
	jobTitle,
}: {
	matchId: string;
	userId: string;
	imageUrl: string;
	name: string;
	jobTitle: string;
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleStartChat = async () => {
		try {
			setIsLoading(true);

			// Check if conversation already exists
			const checkResponse = await fetch(`/api/conversations?userId=${userId}`, {
				cache: "no-store",
			});

			if (!checkResponse.ok) {
				throw new Error("Failed to check conversation");
			}

			const checkData = await checkResponse.json();

			if (checkData.exists && checkData.hasMessages) {
				router.push(`/messages/${checkData.conversation.id}`);
				return;
			}

			setIsModalOpen(true);
		} catch (error) {
			console.error("Error starting chat:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSendMessage = async (message: string) => {
		try {
			const response = await fetch("/api/conversations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					matchId,
					initialMessage: message,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create conversation");
			}

			const conversation = await response.json();
			router.push(`/messages/${conversation.id}`);
		} catch (error) {
			console.error("Error sending message:", error);
			throw error;
		}
	};

	return (
		<>
			<HoverableCard>
				<div className="flex items-start gap-6">
					<UserAvatar src={imageUrl} name={name} size="lg" />

					<div className="flex flex-1 flex-col items-start text-left">
						{/* FIXME: truncate to cater long names/messages */}
						<div className="flex items-center gap-2">
							<Link
								href={`/user/${userId}`}
								className="font-bold text-gh-green-300 text-lg underline-offset-2 hover:text-gh-blue-300 hover:underline dark:text-green-400"
							>
								{name}
							</Link>

							<DiGitMerge className="text-2xl text-blue-400" />
						</div>
						<p>{jobTitle}</p>
					</div>

					<Tooltip color="default" content="Start Chat" closeDelay={0}>
						<Button
							isIconOnly
							variant="flat"
							color="success"
							radius="sm"
							className="my-auto bg-gh-green-50/40 p-2 dark:bg-gh-green-300"
							onPress={handleStartChat}
							isLoading={isLoading}
						>
							{!isLoading && (
								<FaComment
									className="text-gh-green-400 dark:text-white"
									size={26}
								/>
							)}
						</Button>
					</Tooltip>
				</div>
			</HoverableCard>

			<MessageModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				recipientName={name}
				onSend={handleSendMessage}
			/>
		</>
	);
}
