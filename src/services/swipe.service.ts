import type { SwipeType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaginationParams, ServiceResult } from "./types";
import { error, success } from "./types";

export interface GetSwipesParams extends PaginationParams {
	userId: string;
	type?: SwipeType;
}

export interface CreateSwipeParams {
	fromId: string;
	toId: string;
	type: SwipeType;
}

/**
 * Get swipe history for a user
 */
export async function getSwipes({
	userId,
	type,
	limit = 50,
	offset = 0,
}: GetSwipesParams): Promise<ServiceResult<unknown>> {
	try {
		const where = {
			fromId: userId,
			...(type && { type }),
		};

		const [swipes, total] = await Promise.all([
			prisma.swipe.findMany({
				where,
				select: {
					id: true,
					type: true,
					createdAt: true,
					to: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							photo: {
								select: {
									url: true,
								},
							},
							jobTitles: {
								select: {
									jobTitle: {
										select: {
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
			prisma.swipe.count({ where }),
		]);

		return success({
			swipes: swipes.map(swipe => ({
				id: swipe.id,
				type: swipe.type,
				createdAt: swipe.createdAt,
				user: {
					...swipe.to,
					jobTitles: swipe.to.jobTitles.map(jt => jt.jobTitle.name),
				},
			})),
			total,
			limit,
			offset,
		});
	} catch (err) {
		return error("INTERNAL", "Failed to fetch swipes", err);
	}
}

/**
 * Create a swipe and check for matches
 */
export async function createSwipe({
	fromId,
	toId,
	type,
}: CreateSwipeParams): Promise<ServiceResult<unknown>> {
	try {
		// Check if target user exists
		const targetUser = await prisma.user.findUnique({
			where: { id: toId },
		});

		if (!targetUser) {
			return error("NOT_FOUND", "Target user not found");
		}

		// Create swipe (upsert to handle duplicate swipes)
		const swipe = await prisma.swipe.upsert({
			where: {
				fromId_toId: {
					fromId,
					toId,
				},
			},
			create: {
				fromId,
				toId,
				type,
			},
			update: {
				type,
			},
			select: {
				id: true,
				type: true,
				createdAt: true,
			},
		});

		// Check for mutual LIKE to create a match
		let match = null;
		if (type === "LIKE") {
			const reciprocalSwipe = await prisma.swipe.findUnique({
				where: {
					fromId_toId: {
						fromId: toId,
						toId: fromId,
					},
				},
			});

			if (reciprocalSwipe?.type === "LIKE") {
				// Create match (ensure userA < userB for consistency)
				const [userAId, userBId] = [fromId, toId].sort();

				match = await prisma.match.upsert({
					where: {
						userAId_userBId: {
							userAId,
							userBId,
						},
					},
					create: {
						userAId,
						userBId,
					},
					update: {},
					select: {
						id: true,
						createdAt: true,
					},
				});
			}
		}

		return success({
			swipe,
			...(match && { match }),
		});
	} catch (err) {
		return error("INTERNAL", "Failed to create swipe", err);
	}
}
