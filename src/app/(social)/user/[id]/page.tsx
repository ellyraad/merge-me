"use client";

import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FaComment } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { InfoHeader } from "./components/profile-info";
import { UserNotFoundFallback } from "./components/user-not-found";

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

	const { data: currentUser } = useQuery({
		queryKey: ["current-user"],
		queryFn: fetchCurrentUser,
	});

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user", id],
		queryFn: () => fetchUser(id),
		enabled: !!id,
	});

	const isOwnProfile = currentUser?.id === id;

	if (isLoading) {
		return (
			<div className="container mx-auto flex max-w-4xl items-center justify-center px-4 py-8">
				<Spinner size="lg" />
			</div>
		);
	}

	if (error) {
		return <UserNotFoundFallback />;
	}

	if (!user) {
		return null;
	}

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<div className="flex flex-col gap-3">
				{/* Header Section */}
				<div className="flex flex-col items-center gap-6 rounded-2xl border-1 border-gray-800 p-6 sm:flex-row sm:items-start">
					<Image
						alt={`Profile photo of ${user.firstName} ${user.lastName}`}
						height={400}
						src={user.photo?.url}
						width={320}
						className="border-2 border-gray-400 object-cover max-sm:mx-auto"
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
										className="rounded-lg border-2 border-green-950 bg-green-950/80 px-3 py-2 font-bold text-sm text-teal-200"
									>
										{lang.name}
									</div>
								))}
							</div>
						</div>

						<div className="mt-2 flex w-full justify-end gap-2">
							{/* Show message button only for other users' profiles */}
							{!isOwnProfile && (
								<Tooltip content="Message">
									<Button
										variant="solid"
										radius="sm"
										size="sm"
										className="bg-green-800 text-white"
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
										radius="sm"
										size="sm"
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
					<div className="rounded-2xl border-1 border-gray-800 p-6">
						<h2 className="font-semibold text-2xl">Bio</h2>

						<div className="mt-3">
							<p>{user.bio}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
