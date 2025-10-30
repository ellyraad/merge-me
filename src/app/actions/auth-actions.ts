"use server";

import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import {
	type LoginDataSchema,
	type RegisterDataSchema,
	registerDataSchema,
} from "@/lib/schemas";
import type { ActionResult } from "@/lib/types";
import { UserService } from "@/services";

export async function getUserByEmail(email: string) {
	const result = await UserService.getUserByEmail(email);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
}

export async function getAuthUser() {
	const session = await auth();
	const userId = session?.user?.id;
	if (!userId) throw new Error("Unauthorized Access");

	const result = await UserService.getAuthUserById(userId);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
}

export async function signOutUser() {
	await signOut({ redirectTo: "/login", redirect: true });
}

export async function deleteUserAccount(): Promise<ActionResult<string>> {
	try {
		const session = await auth();
		const userId = session?.user?.id;

		if (!userId) {
			return { status: "error", error: "Unauthorized" };
		}

		const result = await UserService.deleteUser(userId);

		if (!result.success) {
			return {
				status: "error",
				error: result.error.message,
			};
		}

		await signOut({ redirectTo: "/login", redirect: true });

		return { status: "success", data: result.data };
	} catch (error) {
		console.error("Error deleting account:", error);
		return {
			status: "error",
			error: "Failed to delete account. Please try again.",
		};
	}
}

export async function signInUser(
	data: LoginDataSchema,
): Promise<
	ActionResult<string | { message: string; doneOnboarding?: boolean }>
> {
	try {
		await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: false,
		});

		const userInfo = await getUserByEmail(data.email);
		return {
			status: "success",
			data: {
				message: "Successfully logged in",
				doneOnboarding: userInfo?.doneOnboarding,
			},
		};
	} catch (error) {
		const fallbackError = {
			status: "error",
			error: "Something else went wrong. Try again.",
		} as ActionResult<string>;

		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { status: "error", error: "Invalid credentials" };
				default:
					return fallbackError;
			}
		}

		return fallbackError;
	}
}

export async function registerUser(
	data: RegisterDataSchema,
): Promise<ActionResult<User>> {
	try {
		const validated = registerDataSchema.safeParse(data);
		if (!validated.success) {
			return { status: "error", error: z.treeifyError(validated.error) };
		}

		const { firstName, lastName, email, password } = validated.data;
		const hashPassword = await bcrypt.hash(password, 10);

		const result = await UserService.createUser({
			firstName,
			lastName,
			email,
			passwordHash: hashPassword,
		});

		if (!result.success) {
			return { status: "error", error: result.error.message };
		}

		return { status: "success", data: result.data };
	} catch (error) {
		console.error(error);

		return {
			status: "error",
			error: "Something went wrong. Please try again later.",
		};
	}
}
