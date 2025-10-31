"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Link } from "@heroui/link";
import { Tooltip } from "@heroui/tooltip";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DiGitMerge } from "react-icons/di";
import { FaComment } from "react-icons/fa";
import { MessageModal } from "@/app/ui/components/message-modal";

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
			<Card className="rounded-md border-1 border-gray-700 bg-surface-1-d px-5 py-4 hover:bg-surface-2-d">
				<div className="flex items-start gap-6">
					<div>
						<Avatar
							src={imageUrl}
							showFallback
							name={name}
							radius="full"
							size="lg"
						/>
					</div>

					<div className="flex flex-1 flex-col items-start text-left">
						{/* FIXME: truncate to cater long names/messages */}
						<div className="flex items-center gap-2">
							<Link
								href={`/user/${userId}`}
								className="font-bold text-green-400 text-lg underline-offset-2 hover:text-gh-blue-300 hover:underline"
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
							className="my-auto bg-gh-green-300 p-2"
							onPress={handleStartChat}
							isLoading={isLoading}
						>
							{!isLoading && <FaComment className="text-white" size={26} />}
						</Button>
					</Tooltip>
				</div>
			</Card>

			<MessageModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				recipientName={name}
				onSend={handleSendMessage}
			/>
		</>
	);
}
