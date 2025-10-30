import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/matches
 * Get all matches for the current user
 */
export async function GET(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const limit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
		const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);

		const userId = session.user.id;

		const [matches, total] = await Promise.all([
			prisma.match.findMany({
				where: {
					OR: [{ userAId: userId }, { userBId: userId }],
				},
				select: {
					id: true,
					createdAt: true,
					userA: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							bio: true,
							city: true,
							country: true,
							photo: {
								select: {
									url: true,
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
					},
					userB: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							bio: true,
							city: true,
							country: true,
							photo: {
								select: {
									url: true,
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
					},
				},
				orderBy: {
					createdAt: "desc",
				},
				take: limit,
				skip: offset,
			}),
			prisma.match.count({
				where: {
					OR: [{ userAId: userId }, { userBId: userId }],
				},
			}),
		]);

		// Transform to include the matched user (the other person)
		const transformedMatches = matches.map(match => {
			const matchedUser = match.userA.id === userId ? match.userB : match.userA;

			return {
				id: match.id,
				createdAt: match.createdAt,
				user: {
					...matchedUser,
					programmingLanguages: matchedUser.programmingLanguages.map(
						pl => pl.programmingLanguage,
					),
					jobTitles: matchedUser.jobTitles.map(jt => jt.jobTitle),
				},
			};
		});

		return NextResponse.json({
			matches: transformedMatches,
			total,
			limit,
			offset,
		});
	} catch (error) {
		console.error("Error fetching matches:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
