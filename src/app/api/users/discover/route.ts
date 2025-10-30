import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/users/discover
 *
 * Get users who share at least one programming language OR have the same job title
 * Query params:
 * - excludeSwiped: if true, exclude users who have already been swiped on (default: false)
 * - limit: maximum number of users to return (default: no limit)
 */
export async function GET(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const currentUserId = session.user.id;

		const { searchParams } = new URL(req.url);
		const excludeSwiped = searchParams.get("excludeSwiped") === "true";
		const limitParam = searchParams.get("limit");
		const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

		const currentUser = await prisma.user.findUnique({
			where: { id: currentUserId },
			select: {
				programmingLanguages: {
					select: {
						programmingLanguageId: true,
					},
				},
				jobTitles: {
					select: {
						jobTitleId: true,
					},
				},
				outgoingSwipes: excludeSwiped
					? {
							select: {
								toId: true,
							},
						}
					: undefined,
			},
		});

		console.log(
			`\n\n-------------------------- CURRENT USER --------------------------`,
		);
		console.log(JSON.stringify(currentUser));

		if (!currentUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const userLanguageIds = currentUser.programmingLanguages.map(
			pl => pl.programmingLanguageId,
		);
		const userJobTitleIds = currentUser.jobTitles.map(jt => jt.jobTitleId);

		// Get IDs of users already swiped on
		const swipedUserIds = excludeSwiped
			? currentUser.outgoingSwipes?.map(swipe => swipe.toId) || []
			: [];

		// Build OR conditions dynamically based on what the user has
		const orConditions = [];

		if (userLanguageIds.length > 0) {
			orConditions.push({
				programmingLanguages: {
					some: {
						programmingLanguageId: {
							in: userLanguageIds,
						},
					},
				},
			});
		}

		if (userJobTitleIds.length > 0) {
			orConditions.push({
				jobTitles: {
					some: {
						jobTitleId: {
							in: userJobTitleIds,
						},
					},
				},
			});
		}

		// If user has no languages or job titles, return empty array
		if (orConditions.length === 0) {
			return NextResponse.json([]);
		}

		// Find users who share at least one programming language OR job title
		const matchingUsers = await prisma.user.findMany({
			where: {
				AND: [
					{ id: { not: currentUserId } }, // Exclude current user
					{ doneOnboarding: true }, // Only show users who completed onboarding
					...(excludeSwiped && swipedUserIds.length > 0
						? [{ id: { notIn: swipedUserIds } }]
						: []),
					{
						OR: orConditions,
					},
				],
			},
			take: limit,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				city: true,
				country: true,
				bio: true,
				photo: {
					select: {
						url: true,
						publicId: true,
					},
				},
				programmingLanguages: {
					select: {
						programmingLanguage: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				jobTitles: {
					select: {
						jobTitle: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
		});

		// Transform the response to flatten programming languages and job titles
		const transformedUsers = matchingUsers.map(user => ({
			...user,
			programmingLanguages: user.programmingLanguages.map(
				pl => pl.programmingLanguage,
			),
			jobTitles: user.jobTitles.map(jt => jt.jobTitle),
		}));

		return NextResponse.json(transformedUsers);
	} catch (error) {
		console.error("Error fetching matching users:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
