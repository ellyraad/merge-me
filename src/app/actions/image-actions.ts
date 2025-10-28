"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "./auth-actions";

function withImageError<T extends unknown[]>(
	fn: (...args: T) => Promise<unknown>,
	action: string,
) {
	return async (...args: T) => {
		try {
			return await fn(...args);
		} catch (error) {
			const msg = error instanceof Error ? error.message : "unknown error";
			console.error(`[${action}] failed:`, msg);
			throw new Error(`Unable to ${action}: ${msg}`);
		}
	};
}

async function updateUserImage(url: string | null, publicId: string | null) {
	const user = await getAuthUser();
	if (!user?.id) throw new Error("Unauthorized Access");

	if (url === null || publicId === null) {
		if (!user.photo) return user;
		return await prisma.user.update({
			where: { id: user?.id },
			data: {
				photo: { delete: true },
			},
		});
	}

	return await prisma.user.update({
		where: { id: user?.id },
		data: {
			photo: {
				upsert: {
					create: { url, publicId },
					update: { url, publicId },
				},
			},
		},
	});
}

export const addImage = withImageError(
	async (url: string, publicId: string) => {
		await updateUserImage(url, publicId);
	},
	"set user image",
);

export const deleteUserImage = withImageError(
	async () => await updateUserImage(null, null),
	"delete user image",
);
