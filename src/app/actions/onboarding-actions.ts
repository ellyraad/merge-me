"use server";

import { prisma } from "@/lib/prisma";
import { type OnboardingSchema, onboardingSchema } from "@/lib/schemas";
import type { ActionResult } from "@/lib/types";
import { getAuthUser } from "./auth-actions";

export async function submitOnboarding(
	data: OnboardingSchema,
): Promise<ActionResult<void>> {
	try {
		const validatedData = onboardingSchema.parse(data);

		const user = await getAuthUser();
		if (!user?.id) {
			return { status: "error", error: "Unauthorized" };
		}

		await prisma.$transaction(
			async tx => {
				await tx.user.update({
					where: { id: user.id },
					data: {
						city: validatedData.city,
						country: validatedData.country,
						bio: validatedData.bio,
						doneOnboarding: true,
					},
				});

				if (validatedData.photo?.publicId) {
					await tx.image.upsert({
						where: { userId: user.id },
						update: {
							url: validatedData.photo.url,
							publicId: validatedData.photo.publicId,
						},
						create: {
							url: validatedData.photo.url,
							publicId: validatedData.photo.publicId,
							userId: user.id,
						},
					});
				}

				if (validatedData.jobTitle) {
					const jobTitle = await tx.jobTitle.upsert({
						where: { name: validatedData.jobTitle },
						update: {},
						create: { name: validatedData.jobTitle },
					});

					await tx.userJobTitle.upsert({
						where: {
							userId_jobTitleId: { userId: user.id, jobTitleId: jobTitle.id },
						},
						update: {},
						create: { userId: user.id, jobTitleId: jobTitle.id },
					});
				}

				for (const langName of validatedData.programmingLanguages) {
					const lang = await tx.programmingLanguage.upsert({
						where: { name: langName },
						update: {},
						create: { name: langName },
					});

					await tx.userProgrammingLanguage.upsert({
						where: {
							userId_programmingLanguageId: {
								userId: user.id,
								programmingLanguageId: lang.id,
							},
						},
						update: {},
						create: { userId: user.id, programmingLanguageId: lang.id },
					});
				}
			},
			{
				maxWait: 5000,
				timeout: 20000,
			},
		);

		return { status: "success", data: undefined };
	} catch (error) {
		console.error("Onboarding submission error:", error);
		return {
			status: "error",
			error: error instanceof Error ? error.message : "Submission failed",
		};
	}
}
