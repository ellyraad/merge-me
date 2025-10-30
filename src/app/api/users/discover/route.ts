import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toResponse } from "@/lib/api-utils";
import { UserService } from "@/services";

/**
 * GET /api/users/discover
 *
 * Get users who share at least one programming language OR have the same job title
 * Query params:
 * - excludeSwiped: if true, exclude users who have already been swiped on (default: false)
 * - limit: maximum number of users to return (default: no limit)
 */
export async function GET(req: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const excludeSwiped = searchParams.get("excludeSwiped") === "true";
	const limitParam = searchParams.get("limit");
	const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

	const result = await UserService.getDiscoverUsers({
		currentUserId: session.user.id,
		excludeSwiped,
		limit,
	});

	return toResponse(result);
}
