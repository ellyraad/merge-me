import { z } from "zod";

const passwordMinLengthParams = {
	length: 8,
	error: `Password must be at least 8 characters long`,
};

const nameMinLengthParams = {
	length: 2,
	error: "Name character length must be at least 2",
};

export const registerDataSchema = z.object({
	firstName: z
		.string()
		.min(nameMinLengthParams.length, { error: nameMinLengthParams.error })
		.trim(),

	lastName: z
		.string()
		.min(nameMinLengthParams.length, { error: nameMinLengthParams.error })
		.trim(),

	email: z.email(),

	password: z.string().min(passwordMinLengthParams.length, {
		error: passwordMinLengthParams.error,
	}),
});
export type RegisterDataSchema = z.infer<typeof registerDataSchema>;

export const loginDataSchema = z.object({
	email: z.email().trim(),
	password: z.string().min(passwordMinLengthParams.length, {
		error: passwordMinLengthParams.error,
	}),
});
export type LoginDataSchema = z.infer<typeof loginDataSchema>;
