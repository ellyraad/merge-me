import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaginationParams, ServiceResult } from "./types";
import { error, success } from "./types";

/**
 * Common user select for match queries
 */
const matchUserSelect = {
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
} satisfies Prisma.UserSelect;

export interface GetMatchesParams extends PaginationParams {
	userId: string;
}

/**
 * Get all matches for a user
 */
export async function getMatches({
	userId,
	limit = 50,
	offset = 0,
}: GetMatchesParams): Promise<ServiceResult<unknown>> {
	try {
		const [matches, total] = await Promise.all([
			prisma.match.findMany({
				where: {
					OR: [{ userAId: userId }, { userBId: userId }],
				},
				select: {
					id: true,
					createdAt: true,
					userA: {
						select: matchUserSelect,
					},
					userB: {
						select: matchUserSelect,
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

		return success({
			matches: transformedMatches,
			total,
			limit,
			offset,
		});
	} catch (err) {
		return error("INTERNAL", "Failed to fetch matches", err);
	}
}
