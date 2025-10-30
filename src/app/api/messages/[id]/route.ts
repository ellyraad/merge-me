import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toResponse } from "@/lib/api-utils";
import { MessageService } from "@/services";

/**
 * PATCH /api/messages/[id]
 * Mark a message as read
 */
export async function PATCH(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;

	const result = await MessageService.markMessageAsRead({
		messageId: id,
		currentUserId: session.user.id,
	});

	return toResponse(result);
}
