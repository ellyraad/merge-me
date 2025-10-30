"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaComment } from "react-icons/fa";

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

	const handleStartChat = async () => {
		try {
			setIsLoading(true);
			// Get or create a conversation with this match
			const response = await fetch("/api/conversations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ matchId }),
			});

			if (!response.ok) {
				throw new Error("Failed to create conversation");
			}

			const conversation = await response.json();
			router.push(`/messages?conversationId=${conversation.id}`);
		} catch (error) {
			console.error("Error starting chat:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
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
	);
}
