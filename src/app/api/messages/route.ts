import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toResponse } from "@/lib/api-utils";
import { createMessageSchema } from "@/lib/schemas";
import { MessageService } from "@/services";

/**
 * POST /api/messages
 * Create a new message in a conversation
 */
export async function POST(req: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json();
	const validated = createMessageSchema.safeParse(body);

	if (!validated.success) {
		return NextResponse.json(
			{ error: "Validation failed", issues: validated.error.issues },
			{ status: 400 },
		);
	}

	const { conversationId, content } = validated.data;

	const result = await MessageService.createMessage({
		conversationId,
		senderId: session.user.id,
		content,
	});

	return toResponse(result, 201);
}
