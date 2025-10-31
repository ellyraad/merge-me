import type { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UpdateUserSchema } from "@/lib/schemas";
import type { ServiceResult } from "./types";
import { error, success } from "./types";

const userProfileSelect = {
	id: true,
	firstName: true,
	lastName: true,
	city: true,
	country: true,
	bio: true,
	createdAt: true,
	photo: {
		select: {
			url: true,
			publicId: true,
		},
	},
	programmingLanguages: {
		select: {
			programmingLanguage: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	},
	jobTitles: {
		select: {
			jobTitle: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	},
} satisfies Prisma.UserSelect;

function transformUserProfile<
	T extends {
		programmingLanguages: { programmingLanguage: unknown }[];
		jobTitles: { jobTitle: unknown }[];
	},
>(user: T) {
	return {
		...user,
		programmingLanguages: user.programmingLanguages.map(
			pl => pl.programmingLanguage,
		),
		jobTitles: user.jobTitles.map(jt => jt.jobTitle),
	};
}

export interface GetUserProfileParams {
	userId: string;
	currentUserId: string;
}

export interface GetDiscoverUsersParams {
	currentUserId: string;
	excludeSwiped?: boolean;
	limit?: number;
}

export async function getUserProfile({
	userId,
	currentUserId,
}: GetUserProfileParams): Promise<ServiceResult<unknown>> {
	try {
		const isOwnProfile = userId === currentUserId;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				...userProfileSelect,
				email: isOwnProfile,
				doneOnboarding: isOwnProfile,
			},
		});

		if (!user) {
			return error("NOT_FOUND", "User not found");
		}

		let matchInfo = null;
		if (!isOwnProfile) {
			const match = await prisma.match.findFirst({
				where: {
					OR: [
						{ userAId: currentUserId, userBId: userId },
						{ userAId: userId, userBId: currentUserId },
					],
				},
				select: {
					id: true,
				},
			});

			if (match) {
				matchInfo = { matchId: match.id };
			}
		}

		return success({
			...transformUserProfile(user),
			match: matchInfo,
		});
	} catch (err) {
		return error("INTERNAL", "Failed to fetch user profile", err);
	}
}

export async function updateUserProfile(
	userId: string,
	data: Omit<UpdateUserSchema, "photo">,
	photo?: UpdateUserSchema["photo"],
): Promise<ServiceResult<unknown>> {
	try {
		// Build the update data
		const updateData: Prisma.UserUpdateInput = {
			...data,
		};

		// If photo is provided, update or create the Image record
		if (photo) {
			updateData.photo = {
				upsert: {
					create: {
						url: photo.url,
						publicId: photo.publicId,
					},
					update: {
						url: photo.url,
						publicId: photo.publicId,
					},
				},
			};
		}

		const user = await prisma.user.update({
			where: { id: userId },
			data: updateData,
			select: {
				...userProfileSelect,
				email: true,
				doneOnboarding: true,
			},
		});

		return success(user);
	} catch (err) {
		return error("INTERNAL", "Failed to update user profile", err);
	}
}

export async function getDiscoverUsers({
	currentUserId,
	excludeSwiped = false,
	limit,
}: GetDiscoverUsersParams): Promise<ServiceResult<unknown>> {
	try {
		const currentUser = await prisma.user.findUnique({
			where: { id: currentUserId },
			select: {
				programmingLanguages: {
					select: {
						programmingLanguageId: true,
					},
				},
				jobTitles: {
					select: {
						jobTitleId: true,
					},
				},
				outgoingSwipes: excludeSwiped
					? {
							select: {
								toId: true,
							},
						}
					: undefined,
			},
		});

		if (!currentUser) {
			return error("NOT_FOUND", "User not found");
		}

		const userLanguageIds = currentUser.programmingLanguages.map(
			pl => pl.programmingLanguageId,
		);
		const userJobTitleIds = currentUser.jobTitles.map(jt => jt.jobTitleId);

		const swipedUserIds = excludeSwiped
			? currentUser.outgoingSwipes?.map(swipe => swipe.toId) || []
			: [];

		const matchingUsers = await prisma.user.findMany({
			where: {
				AND: [
					{ id: { not: currentUserId } },
					{ doneOnboarding: true },
					...(excludeSwiped && swipedUserIds.length > 0
						? [{ id: { notIn: swipedUserIds } }]
						: []),
					{
						OR: [
							{
								programmingLanguages: {
									some: {
										programmingLanguageId: {
											in: userLanguageIds,
										},
									},
								},
							},

							{
								jobTitles: {
									some: {
										jobTitleId: {
											in: userJobTitleIds,
										},
									},
								},
							},
						],
					},
				],
			},
			take: limit,
			select: userProfileSelect,
		});

		const transformedUsers = matchingUsers.map(transformUserProfile);

		return success(transformedUsers);
	} catch (err) {
		return error("INTERNAL", "Failed to fetch discover users", err);
	}
}

export async function deleteUser(
	userId: string,
): Promise<ServiceResult<string>> {
	try {
		await prisma.user.delete({
			where: { id: userId },
		});

		return success("User deleted successfully");
	} catch (err) {
		return error("INTERNAL", "Failed to delete user account", err);
	}
}

export async function getUserByEmail(
	email: string,
): Promise<ServiceResult<User | null>> {
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		return success(user);
	} catch (err) {
		return error("INTERNAL", "Failed to fetch user by email", err);
	}
}

export type AuthUser = User & {
	photo: {
		id: string;
		url: string | null;
		publicId: string | null;
		userId: string;
	} | null;
};

export async function getAuthUserById(
	userId: string,
): Promise<ServiceResult<AuthUser>> {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { photo: true },
		});

		if (!user) {
			return error("NOT_FOUND", "User not found");
		}

		return success(user);
	} catch (err) {
		return error("INTERNAL", "Failed to fetch authenticated user", err);
	}
}

export interface CreateUserParams {
	firstName: string;
	lastName: string;
	email: string;
	passwordHash: string;
}

export async function createUser(
	params: CreateUserParams,
): Promise<ServiceResult<User>> {
	try {
		const { firstName, lastName, email, passwordHash } = params;

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return error("VALIDATION", "Account is already in use");
		}

		const newUser = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				passwordHash,
				bio: "",
				programmingLanguages: {
					create: [],
				},
				jobTitles: {
					create: [],
				},
			},
		});

		return success(newUser);
	} catch (err) {
		return error("INTERNAL", "Failed to create user", err);
	}
}
