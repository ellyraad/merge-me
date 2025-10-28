"use server";

import { prisma } from "@/lib/prisma";

export async function getJobTitles() {
	return await prisma.jobTitle.findMany();
}
