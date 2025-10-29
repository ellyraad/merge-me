"use client";

import { faker } from "@faker-js/faker";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { DiGitMerge } from "react-icons/di";
import { FaHeart } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { GoGitPullRequestClosed } from "react-icons/go";

type SwipeDirection = "left" | "right";

export interface SwipeCardProps {
	onSwipe?: (direction: SwipeDirection, user: FakeUser) => void;
	stackSize?: number;
}

type FakeUser = {
	id: string;
	name: string;
	age: number;
	job: string;
	bio: string;
	avatar: string;
};

const SWIPE_THRESHOLD = 200;
const DEFAULT_STACK = 3;

function generateFakeUser(): FakeUser {
	return {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		age: faker.number.int({ min: 18, max: 55 }),
		job: faker.person.jobTitle(),
		bio: faker.lorem.sentence(),
		avatar: `https://picsum.photos/seed/${faker.string.uuid()}/640/800?blur=1`,
	};
}

// Card component with new drag mechanism
function Card({
	user,
	isTop,
	index,
	totalCards,
	onSwipe,
}: {
	user: FakeUser;
	isTop: boolean;
	index: number;
	totalCards: number;
	onSwipe?: (direction: SwipeDirection) => void;
}) {
	// Motion values for smooth dragging without re-renders
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-400, 400], [-50, 50]);
	const opacity = useTransform(x, [-400, -300, 0, 300, 400], [0, 1, 1, 1, 0]);

	// Calculate stack position
	const depth = totalCards - 1 - index;
	const scale = 1 - depth * 0.03;
	const translateY = depth * 10;
	const zIndex = 100 + index;

	// Swipe direction label opacity
	const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
	const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

	const handleDragEnd = () => {
		if (!isTop) return;

		const currentX = x.get();

		if (currentX > SWIPE_THRESHOLD) {
			// Swiped right
			onSwipe?.("right");
			x.set(0);
		} else if (currentX < -SWIPE_THRESHOLD) {
			// Swiped left
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
					? `You approved ${user.name}'s changes.`
					: `You requested changes on ${user.name}'s code.`,
			color: direction === "right" ? "success" : "danger",
		});
	};

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
			className="absolute top-0 left-0 flex h-full w-full select-none flex-col overflow-hidden rounded-lg bg-gray-700"
		>
			{/* Image */}
			<div
				className="flex-1 bg-center bg-cover"
				style={{ backgroundImage: `url(${user.avatar})` }}
			/>

			{/* User Info */}
			<div className="flex-none border-slate-800 border-t bg-slate-900 p-4 text-white">
				<div className="flex items-baseline gap-2">
					<div className="font-bold text-xl">
						{user.name}, {user.age}
					</div>
					<div className="text-slate-400 text-sm">{user.job}</div>
				</div>
				<div className="mt-2 text-slate-300 text-sm">{user.bio}</div>

				{/* Action Buttons */}
				{isTop && (
					<div className="mt-5 flex gap-2">
						<Button
							variant="flat"
							color="danger"
							fullWidth
							radius="sm"
							onPress={() => handleButtonSwipe("left")}
							className="flex items-center"
						>
							<FaX size={15} />
							<span className="font-bold text-lg">NGTM</span>
						</Button>

						<Button
							onPress={() => handleButtonSwipe("right")}
							variant="solid"
							color="success"
							radius="sm"
							fullWidth
							className="flex items-center"
						>
							<span className="font-bold text-lg">LGTM</span>
							<FaHeart size={15} />
						</Button>
					</div>
				)}
			</div>

			{/* Swipe Labels */}
			{isTop && (
				<>
					<motion.div
						className="pointer-events-none absolute top-5 left-5 rounded-md bg-red-600 px-3 py-1 font-bold text-2xl text-white uppercase tracking-wide"
						style={{ opacity: nopeOpacity }}
					>
						<GoGitPullRequestClosed />
					</motion.div>
					<motion.div
						className="pointer-events-none absolute top-5 right-5 rounded-md bg-blue-700 px-3 py-1 font-bold text-2xl text-white uppercase tracking-wide"
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
	const [users, setUsers] = useState<FakeUser[]>(() =>
		Array.from({ length: stackSize }, generateFakeUser)
	);

	const handleSwipe = (direction: SwipeDirection) => {
		const topUser = users[users.length - 1];
		onSwipe?.(direction, topUser);

		// Remove top card and add new one at bottom
		setUsers((prev) => [...prev.slice(0, -1), generateFakeUser()]);
	};

	return (
		<div className="relative isolate m-6 h-[550px] w-[300px] sm:h-[600px] sm:w-[400px]">
			{users.map((user, index) => (
				<Card
					key={user.id}
					user={user}
					isTop={index === users.length - 1}
					index={index}
					totalCards={users.length}
					onSwipe={handleSwipe}
				/>
			))}
		</div>
	);
}
