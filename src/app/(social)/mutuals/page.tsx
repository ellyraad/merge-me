"use client";

import { Skeleton } from "@heroui/skeleton";
import { Tooltip } from "@heroui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/app/ui/components/empty-state";
import { ErrorState } from "@/app/ui/components/error-state";
import type { MatchesResponse } from "@/lib/types";

import { MutualListItem } from "./components/mutual-list-item";

async function fetchMatches(): Promise<MatchesResponse> {
	const response = await fetch("/api/matches");

	if (!response.ok) {
		throw new Error("Failed to fetch matches");
	}

	return response.json();
}

export default function MutualsPage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["matches"],
		queryFn: fetchMatches,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return (
		<main className="container mx-auto max-w-3xl py-2 sm:py-8">
			<h1 className="font-bold text-2xl">
				People who approved your{" "}
				<Tooltip content="Pull Request" closeDelay={0}>
					<span>PR</span>
				</Tooltip>{" "}
			</h1>

			<div className="mt-10 flex flex-col gap-3">
				{isLoading &&
					Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton loaders don't change
						<Skeleton key={`skeleton-${i}`} className="h-20 rounded-lg" />
					))}

				{error && (
					<ErrorState title="Failed to load matches. Please try again later." />
				)}

				{!(isLoading || error) && data?.matches.length === 0 && (
					<EmptyState
						title="No matches yet"
						description="Keep swiping to find people who share your interests!"
					/>
				)}

				{!(isLoading || error) &&
					data?.matches.map(match => {
						const fullName = `${match.user.firstName} ${match.user.lastName}`;
						const primaryJobTitle =
							match.user.jobTitles[0]?.name || "Developer";
						const avatarUrl =
							match.user.photo?.url ||
							`https://ui-avatars.com/api/?name=${fullName}`;

						return (
							<MutualListItem
								key={match.id}
								userId={match.user.id}
								matchId={match.id}
								name={fullName}
								jobTitle={primaryJobTitle}
								imageUrl={avatarUrl}
							/>
						);
					})}
			</div>
		</main>
	);
}
