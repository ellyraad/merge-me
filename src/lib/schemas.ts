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

export const onboardingSchema = z.object({
	bio: z.string().min(10, {
		error: "Must be 10 characters or more.",
	}),

	// https://en.wikipedia.org/wiki/List_of_short_place_names
	city: z.string().min(1, {
		error: "City is required",
	}),

	country: z.string().min(4, {
		error: "Country is required",
	}),

	jobTitle: z.string(),

	programmingLanguages: z.array(z.string()).max(3).min(1, {
		error: "Select at least one programming language",
	}),

	photo: z.object({
		publicId: z.string(),
		url: z.url(),
	}),
});
export type OnboardingSchema = z.infer<typeof onboardingSchema>;
