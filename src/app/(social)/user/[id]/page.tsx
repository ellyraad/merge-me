"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Tooltip } from "@heroui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaComment } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { ErrorState } from "@/app/ui/components/error-state";
import { LoadingState } from "@/app/ui/components/loading-state";
import { MessageModal } from "@/app/ui/components/message-modal";
import { InfoHeader } from "./components/profile-info";

interface UserProfile {
	id: string;
	firstName: string;
	lastName: string;
	email?: string;
	city: string | null;
	country: string | null;
	bio: string | null;
	createdAt: string;
	doneOnboarding?: boolean;
	photo: {
		url: string;
		publicId: string;
	} | null;
	programmingLanguages: Array<{
		id: string;
		name: string;
	}>;
	jobTitles: Array<{
		id: string;
		name: string;
	}>;
	match?: {
		matchId: string;
	} | null;
}

async function fetchUser(id: string): Promise<UserProfile> {
	const response = await fetch(`/api/users?id=${id}`);

	if (!response.ok) {
		throw new Error("Failed to fetch user");
	}

	return response.json();
}

async function fetchCurrentUser(): Promise<UserProfile> {
	const response = await fetch("/api/users");

	if (!response.ok) {
		throw new Error("Failed to fetch current user");
	}

	return response.json();
}

export default function ProfilePage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { data: currentUser } = useQuery({
		queryKey: ["current-user"],
		queryFn: fetchCurrentUser,
	});

	const {
		data: user,
		isLoading: isUserLoading,
		error,
	} = useQuery({
		queryKey: ["user", id],
		queryFn: () => fetchUser(id),
		enabled: !!id,
	});

	const isOwnProfile = currentUser?.id === id;

	const handleMessageClick = async () => {
		if (!user?.match?.matchId) {
			return;
		}

		try {
			setIsLoading(true);

			// Check if conversation already exists
			const checkResponse = await fetch(
				`/api/conversations?userId=${user.id}`,
				{
					cache: "no-store",
				},
			);

			if (!checkResponse.ok) {
				throw new Error("Failed to check conversation");
			}

			const checkData = await checkResponse.json();

			// If conversation exists and has messages, go directly to it
			if (checkData.exists && checkData.hasMessages) {
				router.push(`/messages/${checkData.conversation.id}`);
				return;
			}

			// If conversation exists but no messages, or doesn't exist, show modal
			setIsModalOpen(true);
		} catch (error) {
			console.error("Error starting chat:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSendMessage = async (message: string) => {
		if (!user?.match?.matchId) {
			throw new Error("No match found");
		}

		try {
			// Create conversation with initial message
			const response = await fetch("/api/conversations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					matchId: user.match.matchId,
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

	if (isUserLoading) {
		return <LoadingState />;
	}

	if (error) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<ErrorState
					title="User not found"
					description="The user you're looking for doesn't exist or has been removed."
				/>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const fullName = `${user.firstName} ${user.lastName}`;

	return (
		<>
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<div className="flex flex-col gap-3">
					{/* Header Section */}
					<div className="flex flex-col items-center gap-6 rounded-lg border-1 border-gray-200 bg-surface-1-l/30 p-6 shadow-md sm:flex-row sm:items-start dark:border-gray-800 dark:bg-surface-1-d">
						<Image
							alt={`Profile photo of ${user.firstName} ${user.lastName}`}
							height={400}
							src={user.photo?.url}
							width={320}
							className="rounded-sm border-gray-400 object-cover max-sm:mx-auto dark:border-2"
						/>

						<div className="flex w-full flex-col gap-4 md:w-5/9">
							<div className="flex flex-col gap-4">
								<InfoHeader
									className="flex flex-col gap-1 max-sm:text-center"
									firstName={user.firstName}
									lastName={user.lastName}
									jobTitle={user.jobTitles[0].name}
									city={user.city}
									country={user.country}
								/>

								<div className="mt-3 flex flex-col gap-2">
									<h2 className="font-bold text-lg">Top Languages:</h2>
									{user.programmingLanguages.map(lang => (
										<div
											key={lang.id}
											className="rounded-sm border-1 border-green-300 bg-green-200 px-3 py-2 font-bold text-sm dark:border-green-950 dark:bg-green-950/80 dark:text-teal-200"
										>
											{lang.name}
										</div>
									))}
								</div>
							</div>

							<div className="mt-2 flex w-full justify-end gap-2">
								{/* Show message button only for other users' profiles who are matches */}
								{!isOwnProfile && user.match && (
									<Tooltip content="Message">
										<Button
											variant="solid"
											size="sm"
											className="rounded-sm bg-green-800 text-white"
											onPress={handleMessageClick}
											isLoading={isLoading}
										>
											<FaComment size={16} /> Message
										</Button>
									</Tooltip>
								)}

								{/* Show edit button only for current user's profile */}
								{isOwnProfile && (
									<Tooltip content="Edit Profile">
										<Button
											isIconOnly
											variant="faded"
											color="default"
											size="sm"
											className="rounded-sm"
										>
											<FaPencil size={16} />
										</Button>
									</Tooltip>
								)}
							</div>
						</div>
					</div>

					{/* Bio Section */}
					{user.bio && (
						<div className="rounded-lg border-1 border-gray-200 bg-surface-1-l/20 p-6 shadow-md dark:border-gray-800 dark:bg-surface-2-d">
							<h2 className="font-semibold text-2xl">Bio</h2>

							<div className="mt-3">
								<Divider className="mb-3" />

								<p>{user.bio}</p>
							</div>
						</div>
					)}
				</div>
			</div>

			<MessageModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				recipientName={fullName}
				onSend={handleSendMessage}
			/>
		</>
	);
}
