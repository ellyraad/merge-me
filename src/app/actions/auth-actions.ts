"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { email, z } from "zod";
import { signIn } from "@/auth";
import type { User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
	type LoginDataSchema,
	type RegisterDataSchema,
	registerDataSchema,
} from "@/lib/schemas";
import type { ActionResult } from "@/lib/types";

export async function getUserByEmail(email: string) {
	return await prisma.user.findUnique({ where: { email } });
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

		const isExistingUser = await prisma.user.findUnique({ where: { email } });
		if (isExistingUser) {
			return { status: "error", error: "Account is already in use" };
		}

		const newUser = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				passwordHash: hashPassword,

				// the following data will be altered during onboarding
				bio: "",
				programmingLanguages: {
					create: [],
				},
				jobTitles: {
					create: [],
				},
			},
		});

		return { status: "success", data: newUser };
	} catch (error) {
		console.error(error);

		return {
			status: "error",
			error: "Something went wrong. Please try again later.",
		};
	}
}
