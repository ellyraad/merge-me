import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toResponse } from "@/lib/api-utils";
import { ConversationService } from "@/services";

/**
 * GET /api/conversations
 * Get all conversations for the current user
 * Query params:
 * - limit: number (default 50)
 * - offset: number (default 0)
 * - userId: string (optional) - check if conversation exists with this user
 */
export async function GET(req: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const otherUserId = searchParams.get("userId");

	// check for existing convo
	if (otherUserId) {
		const result = await ConversationService.checkConversationExists({
			currentUserId: session.user.id,
			otherUserId,
		});

		return toResponse(result);
	}

	const limit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
	const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);

	const result = await ConversationService.getConversations({
		userId: session.user.id,
		limit,
		offset,
	});

	return toResponse(result);
}

/**
 * POST /api/conversations
 * Create a new conversation (only if a match exists)
 * Optionally send initial message with { matchId, initialMessage }
 */
export async function POST(req: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json();
	const { matchId, initialMessage } = body;

	if (!matchId || typeof matchId !== "string") {
		return NextResponse.json({ error: "matchId is required" }, { status: 400 });
	}

	const result = await ConversationService.createConversation({
		matchId,
		currentUserId: session.user.id,
		initialMessage,
	});

	return toResponse(result, 201);
}
