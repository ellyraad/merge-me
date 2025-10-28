"use server";

import { prisma } from "@/lib/prisma";

export async function getProgrammingLanguages() {
	return await prisma.programmingLanguage.findMany({
		orderBy: { name: "asc" },
	});
}
