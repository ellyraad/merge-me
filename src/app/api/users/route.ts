import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/schemas";

/**
 * GET /api/users
 * Get current authenticated user profile
 */
export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
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
