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

// API Schemas
export const updateUserSchema = z.object({
	firstName: z
		.string()
		.min(nameMinLengthParams.length, { error: nameMinLengthParams.error })
		.trim()
		.optional(),
	lastName: z
		.string()
		.min(nameMinLengthParams.length, { error: nameMinLengthParams.error })
		.trim()
		.optional(),
	bio: z.string().min(10).optional(),
	city: z.string().min(1).optional(),
	country: z.string().min(4).optional(),
	photo: z
		.object({
			publicId: z.string(),
			url: z.url(),
		})
		.optional(),
});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const createSwipeSchema = z.object({
	toId: z.cuid(),
	type: z.enum(["PASS", "LIKE"]),
});
export type CreateSwipeSchema = z.infer<typeof createSwipeSchema>;

export const createMessageSchema = z.object({
	conversationId: z.cuid(),
	content: z.string().min(1).max(1000),
});
export type CreateMessageSchema = z.infer<typeof createMessageSchema>;

export const markMessageReadSchema = z.object({
	messageId: z.cuid(),
});
export type MarkMessageReadSchema = z.infer<typeof markMessageReadSchema>;
