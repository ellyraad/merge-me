"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
			<Card>
				<CardBody>
					<div className="flex items-center justify-between">
						<User
							isFocusable
							avatarProps={{
								src: imageUrl,
								size: "lg",
							}}
							description={<p className="text-gray-400 text-lg">{jobTitle}</p>}
							name={
								<Link
									href={`/user/${userId}`}
									className="font-bold text-green-400 text-lg underline-offset-2 hover:underline"
								>
									{name}
								</Link>
							}
						/>

						<Tooltip color="default" content="Start Chat" closeDelay={0}>
							<Button
								isIconOnly
								variant="flat"
								color="success"
								radius="lg"
								className="bg-green-800 px-2"
								onPress={handleStartChat}
								isLoading={isLoading}
							>
								{!isLoading && <FaComment className="text-white" size={26} />}
							</Button>
						</Tooltip>
					</div>
				</CardBody>
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
