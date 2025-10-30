import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toResponse } from "@/lib/api-utils";
import { updateUserSchema } from "@/lib/schemas";
import { UserService } from "@/services";

/**
 * GET /api/users?id=<userId>
 * Get user profile by ID (if id provided) or current authenticated user profile
 */
export async function GET(req: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("id");

	const targetUserId = userId || session.user.id;

	const result = await UserService.getUserProfile({
		userId: targetUserId,
		currentUserId: session.user.id,
	});

	return toResponse(result);
}

/**
 * PUT /api/users
 * Update current authenticated user profile
 */
export async function PUT(req: Request) {
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

	const result = await UserService.updateUserProfile(
		session.user.id,
		validated.data,
	);

	return toResponse(result);
}
