"use client";

import { Button } from "@heroui/button";
import { addToast, Skeleton } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { DiGitMerge } from "react-icons/di";
import { FaHeart } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { GoGitPullRequestClosed } from "react-icons/go";
import type { DiscoverUser, SwipeDirection, SwipeResponse } from "@/lib/types";

export interface SwipeCardProps {
	onSwipe?: (direction: SwipeDirection, user: DiscoverUser) => void;
	stackSize?: number;
}

const SWIPE_THRESHOLD = 200;
const DEFAULT_STACK = 10;

async function fetchDiscoverUsers(limit: number): Promise<DiscoverUser[]> {
	const response = await fetch(
		`/api/users/discover?excludeSwiped=true&limit=${limit}`,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}

	return response.json();
}

async function recordSwipe(
	userId: string,
	type: "LIKE" | "PASS",
): Promise<SwipeResponse> {
	const response = await fetch("/api/swipes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			toId: userId,
			type,
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to record swipe");
	}

	return response.json();
}

function Card({
	user,
	isTop,
	index,
	totalCards,
	onSwipe,
}: {
	user: DiscoverUser;
	isTop: boolean;
	index: number;
	totalCards: number;
	onSwipe?: (direction: SwipeDirection) => void;
}) {
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-400, 400], [-50, 50]);
	const opacity = useTransform(x, [-400, -300, 0, 300, 400], [0, 1, 1, 1, 0]);

	const depth = totalCards - 1 - index;
	const scale = 1 - depth * 0.03;
	const translateY = depth * 10;
	const zIndex = 100 + index;

	const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
	const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

	const handleDragEnd = () => {
		if (!isTop) return;

		const currentX = x.get();

		if (currentX > SWIPE_THRESHOLD) {
			onSwipe?.("right");
			x.set(0);
		} else if (currentX < -SWIPE_THRESHOLD) {
			onSwipe?.("left");
			x.set(0);
		}
	};

	const handleButtonSwipe = (direction: SwipeDirection) => {
		if (!isTop) return;
		onSwipe?.(direction);
		addToast({
			title: direction === "right" ? "LGTM!" : "Checks Failed",
			description:
				direction === "right"
					? `You approved ${user.firstName}'s changes.`
					: `You requested changes on ${user.firstName}'s code.`,
			color: direction === "right" ? "success" : "danger",
		});
	};

	const fullName = `${user.firstName} ${user.lastName}`;
	const location = [user.city, user.country].filter(Boolean).join(", ");
	const primaryJobTitle = user.jobTitles[0]?.name || "Developer";
	const avatarUrl =
		user.photo?.url || `https://ui-avatars.com/api/?name=${fullName}`;

	return (
		<motion.div
			drag={isTop ? "x" : false}
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={1}
			onDragEnd={handleDragEnd}
			style={{
				x: isTop ? x : 0,
				rotate: isTop ? rotate : 0,
				opacity,
				scale,
				y: translateY,
				zIndex,
				cursor: isTop ? "grab" : "default",
			}}
			whileTap={isTop ? { cursor: "grabbing" } : undefined}
			className="absolute top-0 left-0 flex h-full w-full select-none flex-col overflow-hidden rounded-lg border-1 border-gray-700 hover:border-gh-blue-300"
		>
			<div
				className="flex-1 bg-center bg-cover"
				style={{ backgroundImage: `url(${avatarUrl})` }}
			/>

			<div className="flex-none border-slate-800 border-t bg-surface-2-d p-4 text-white">
				<div className="flex flex-col gap-1">
					<div className="font-bold text-xl">{fullName}</div>
					<div className="text-slate-400 text-sm">{primaryJobTitle}</div>
					{location && <div className="text-slate-500 text-xs">{location}</div>}
				</div>

				<div className="mt-2 text-slate-300 text-sm">{user.bio}</div>

				{user.programmingLanguages.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-2">
						{user.programmingLanguages.map(lang => (
							<span
								key={lang.id}
								className="rounded-full bg-blue-600/20 px-3 py-1 text-blue-300 text-xs"
							>
								{lang.name}
							</span>
						))}
					</div>
				)}

				{isTop && (
					<div className="mt-5 flex gap-2">
						<Button
							variant="bordered"
							color="danger"
							fullWidth
							onPress={() => handleButtonSwipe("left")}
							className="flex items-center rounded-sm"
						>
							<FaX size={15} />
							<span className="font-bold text-lg">NGTM</span>
						</Button>

						<Button
							onPress={() => handleButtonSwipe("right")}
							variant="solid"
							color="success"
							fullWidth
							className="flex items-center rounded-sm bg-gh-green-300 text-foreground"
						>
							<span className="font-bold text-lg">LGTM</span>
							<FaHeart size={15} />
						</Button>
					</div>
				)}
			</div>

			{isTop && (
				<>
					<motion.div
						className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 rounded-full bg-red-600 p-7 font-bold text-8xl text-white uppercase tracking-wide"
						style={{ opacity: nopeOpacity }}
					>
						<GoGitPullRequestClosed />
					</motion.div>
					<motion.div
						className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 rounded-full bg-blue-700 p-7 font-bold text-8xl text-white uppercase tracking-wide"
						style={{ opacity: likeOpacity }}
					>
						<DiGitMerge />
					</motion.div>
				</>
			)}
		</motion.div>
	);
}

export function CardStacks({
	onSwipe,
	stackSize = DEFAULT_STACK,
}: SwipeCardProps) {
	const queryClient = useQueryClient();
	const [displayedUsers, setDisplayedUsers] = useState<DiscoverUser[]>([]);

	const {
		data: users,
		isLoading,
		isFetching,
		error,
	} = useQuery({
		queryKey: ["discover-users", stackSize],
		queryFn: () => fetchDiscoverUsers(stackSize),
		staleTime: 1000 * 60 * 5,
	});

	useEffect(() => {
		if (!users || users.length === 0) return;

		setDisplayedUsers(prev => {
			if (prev.length === 0) {
				return users;
			}

			const existingIds = new Set(prev.map(u => u.id));
			const newUsers = users.filter(u => !existingIds.has(u.id));

			if (newUsers.length > 0) {
				return [...newUsers, ...prev];
			}

			return prev;
		});
	}, [users]);

	const swipeMutation = useMutation({
		mutationFn: ({ userId, type }: { userId: string; type: "LIKE" | "PASS" }) =>
			recordSwipe(userId, type),
		onSuccess: data => {
			if (data.match) {
				addToast({
					title: "It's a Match!",
					description: "You both liked each other! Start chatting now.",
					color: "success",
				});
			}
		},
		onError: () => {
			addToast({
				title: "Error",
				description: "Failed to record swipe. Please try again.",
				color: "danger",
			});
		},
	});

	const handleSwipe = (direction: SwipeDirection) => {
		if (displayedUsers.length === 0) return;

		const topUser = displayedUsers[displayedUsers.length - 1];
		onSwipe?.(direction, topUser);

		swipeMutation.mutate({
			userId: topUser.id,
			type: direction === "right" ? "LIKE" : "PASS",
		});

		setDisplayedUsers(prev => prev.slice(0, -1));

		if (displayedUsers.length <= 1) {
			queryClient.invalidateQueries({ queryKey: ["discover-users"] });
		}
	};

	if (isLoading) {
		return (
			<Skeleton className="mt-5 rounded-lg">
				<div className="h-[550px] w-[300px] sm:h-[600px] sm:w-[400px]" />
			</Skeleton>
		);
	}

	if (error) {
		return (
			<div className="flex h-[550px] w-[300px] flex-col items-center justify-center gap-4 sm:h-[600px] sm:w-[400px]">
				<p className="text-red-400">Failed to load users</p>
				<Button
					color="primary"
					onPress={() =>
						queryClient.invalidateQueries({ queryKey: ["discover-users"] })
					}
				>
					Try Again
				</Button>
			</div>
		);
	}

	if (!users || users.length === 0 || displayedUsers.length === 0) {
		return (
			<div className="flex h-[550px] w-[300px] flex-col items-center justify-center gap-4 sm:h-[600px] sm:w-[400px]">
				<p className="text-center text-slate-400">
					No more users to show.
					<br />
					Check back later!
				</p>
				<Button
					color="primary"
					isLoading={isFetching}
					onPress={() =>
						queryClient.invalidateQueries({ queryKey: ["discover-users"] })
					}
				>
					Refresh
				</Button>
			</div>
		);
	}

	return (
		<div className="relative isolate m-6 h-[550px] w-[300px] sm:h-[600px] sm:w-[400px]">
			{displayedUsers.map((user, index) => (
				<Card
					key={user.id}
					user={user}
					isTop={index === displayedUsers.length - 1}
					index={index}
					totalCards={displayedUsers.length}
					onSwipe={handleSwipe}
				/>
			))}
		</div>
	);
}
