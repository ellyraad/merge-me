import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/schemas";

/**
 * GET /api/users?id=<userId>
 * Get user profile by ID (if id provided) or current authenticated user profile
 */
export async function GET(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("id");

		// If no ID provided, return current user's profile
		const targetUserId = userId || session.user.id;

		// Determine which fields to include based on whether it's the current user
		const isOwnProfile = targetUserId === session.user.id;

		const user = await prisma.user.findUnique({
			where: { id: targetUserId },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: isOwnProfile, // Only show email for own profile
				city: true,
				country: true,
				bio: true,
				createdAt: true,
				doneOnboarding: isOwnProfile, // Only show for own profile
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

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({
			...user,
			programmingLanguages: user.programmingLanguages.map(
				pl => pl.programmingLanguage,
			),
			jobTitles: user.jobTitles.map(jt => jt.jobTitle),
		});
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/users
 * Update current authenticated user profile
 */
export async function PUT(req: Request) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const validated = updateUserSchema.safeParse(body);

		if (!validated.success) {
			return NextResponse.json(
				{ error: "Validation failed", issues: validated.error.issues },
				{ status: 400 },
			);
		}

		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: validated.data,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				city: true,
				country: true,
				bio: true,
				createdAt: true,
				doneOnboarding: true,
				photo: {
					select: {
						url: true,
						publicId: true,
					},
				},
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error updating user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
