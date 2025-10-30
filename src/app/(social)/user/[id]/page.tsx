"use client";

import { Spinner } from "@heroui/spinner";
import { User } from "@heroui/user";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

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

export default function ProfilePage() {
	const { id } = useParams<{ id: string }>();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user", id],
		queryFn: () => fetchUser(id),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<div className="container mx-auto flex max-w-4xl items-center justify-center px-4 py-8">
				<Spinner size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-danger border-dashed py-16">
					<p className="text-danger text-xl">User not found</p>
					<p className="text-foreground-400 text-sm">
						The user you're looking for doesn't exist or has been removed.
					</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const fullName = `${user.firstName} ${user.lastName}`;
	const location = [user.city, user.country].filter(Boolean).join(", ");
	const primaryJobTitle = user.jobTitles[0]?.name || "Developer";
	const avatarUrl = user.photo?.url;

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<div className="flex flex-col gap-6">
				{/* Header Section */}
				<div className="flex flex-col items-center gap-4 rounded-lg bg-gray-900/60 p-6 sm:flex-row sm:items-start">
					<User
						avatarProps={{
							src: avatarUrl,
							size: "lg",
							className: "h-24 w-24",
						}}
						name={<h1 className="font-bold text-2xl">{fullName}</h1>}
						description={
							<div className="flex flex-col gap-1">
								<p className="text-foreground-500 text-sm">{primaryJobTitle}</p>
								{location && (
									<p className="text-foreground-400 text-xs">{location}</p>
								)}
							</div>
						}
					/>
				</div>

				{/* Bio Section */}
				{user.bio && (
					<div className="rounded-lg bg-gray-900/60 p-6">
						<h2 className="mb-3 font-semibold text-lg">About</h2>
						<p className="text-foreground-500">{user.bio}</p>
					</div>
				)}

				{/* Programming Languages */}
				{user.programmingLanguages.length > 0 && (
					<div className="rounded-lg bg-gray-900/60 p-6">
						<h2 className="mb-3 font-semibold text-lg">
							Programming Languages
						</h2>
						<div className="flex flex-wrap gap-2">
							{user.programmingLanguages.map(lang => (
								<span
									key={lang.id}
									className="rounded-full bg-blue-600/20 px-4 py-2 text-blue-300 text-sm"
								>
									{lang.name}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Job Titles */}
				{user.jobTitles.length > 1 && (
					<div className="rounded-lg bg-gray-900/60 p-6">
						<h2 className="mb-3 font-semibold text-lg">Roles</h2>
						<div className="flex flex-wrap gap-2">
							{user.jobTitles.map(title => (
								<span
									key={title.id}
									className="rounded-full bg-green-600/20 px-4 py-2 text-green-300 text-sm"
								>
									{title.name}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
