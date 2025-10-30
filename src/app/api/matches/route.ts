import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toResponse } from "@/lib/api-utils";
import { MatchService } from "@/services";

/**
 * GET /api/matches
 * Get all matches for the current user
 */
export async function GET(req: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const limit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
	const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);

	const result = await MatchService.getMatches({
		userId: session.user.id,
		limit,
		offset,
	});

	return toResponse(result);
}
