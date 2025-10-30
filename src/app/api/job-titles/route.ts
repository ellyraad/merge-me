import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/job-titles
 * Get all available job titles
 */
export async function GET() {
	try {
		const jobTitles = await prisma.jobTitle.findMany({
			select: {
				id: true,
				name: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json({
			jobTitles,
			total: jobTitles.length,
		});
	} catch (error) {
		console.error("Error fetching job titles:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
