import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toResponse } from "@/lib/api-utils";
import { ConversationService } from "@/services";

/**
 * GET /api/conversations/[id]
 * Get a single conversation with all messages
 */
export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;

	const result = await ConversationService.getConversationById({
		conversationId: id,
		currentUserId: session.user.id,
	});

	return toResponse(result);
}
