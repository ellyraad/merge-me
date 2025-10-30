import type { SwipeType } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSwipeSchema } from "@/lib/schemas";

/**
 * GET /api/swipes
 * Get swipe history for the current user
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
		const type = searchParams.get("type") as SwipeType | null;

		const where = {
			fromId: session.user.id,
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

		return NextResponse.json({
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
	} catch (error) {
		console.error("Error fetching swipes:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/swipes
 * Create a new swipe (LIKE or PASS)
 */
export async function POST(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validated = createSwipeSchema.safeParse(body);

		if (!validated.success) {
			return NextResponse.json(
				{ error: "Validation failed", issues: validated.error.issues },
				{ status: 400 },
			);
		}

		const { toId, type } = validated.data;

		// Check if target user exists
		const targetUser = await prisma.user.findUnique({
			where: { id: toId },
		});

		if (!targetUser) {
			return NextResponse.json(
				{ error: "Target user not found" },
				{ status: 404 },
			);
		}

		// Create swipe (upsert to handle duplicate swipes)
		const swipe = await prisma.swipe.upsert({
			where: {
				fromId_toId: {
					fromId: session.user.id,
					toId,
				},
			},
			create: {
				fromId: session.user.id,
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
						toId: session.user.id,
					},
				},
			});

			if (reciprocalSwipe?.type === "LIKE") {
				// Create match (ensure userA < userB for consistency)
				const [userAId, userBId] = [session.user.id, toId].sort();

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

		return NextResponse.json(
			{
				swipe,
				...(match && { match }),
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating swipe:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
