import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/programming-languages
 * Get all available programming languages
 */
export async function GET() {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const programmingLanguages = await prisma.programmingLanguage.findMany({
			select: {
				id: true,
				name: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json({
			programmingLanguages,
			total: programmingLanguages.length,
		});
	} catch (error) {
		console.error("Error fetching programming languages:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
