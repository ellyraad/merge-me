import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "./config";

export const registerDataSchema = z.object({
	firstName: z
		.string()
		.min(2, {
			error: "Name character length must be at least 2",
		})
		.trim(),

	lastName: z
		.string()
		.min(2, {
			error: "Name character length must be at least 2",
		})
		.trim(),

	email: z.email(),

	password: z.string().min(MIN_PASSWORD_LENGTH, {
		error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
	}),
});
export type RegisterDataSchema = z.infer<typeof registerDataSchema>;
