import type { SwipeType } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toResponse } from "@/lib/api-utils";
import { createSwipeSchema } from "@/lib/schemas";
import { SwipeService } from "@/services";

/**
 * GET /api/swipes
 * Get swipe history for the current user
 */
export async function GET(req: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const limit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
	const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
	const type = searchParams.get("type") as SwipeType | null;

	const result = await SwipeService.getSwipes({
		userId: session.user.id,
		type: type || undefined,
		limit,
		offset,
	});

	return toResponse(result);
}

/**
 * POST /api/swipes
 * Create a new swipe (LIKE or PASS)
 */
export async function POST(req: Request) {
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

	const result = await SwipeService.createSwipe({
		fromId: session.user.id,
		toId,
		type,
	});

	return toResponse(result, 201);
}
