"use client";

import { Input, Textarea } from "@heroui/input";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { UpdateUserSchema } from "@/lib/schemas";

interface EditProfileFormProps {
	register: UseFormRegister<UpdateUserSchema>;
	errors: FieldErrors<UpdateUserSchema>;
}

export function EditProfileForm({ register, errors }: EditProfileFormProps) {
	return (
		<div className="mt-3 flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Input
					radius="sm"
					label="First Name"
					variant="bordered"
					isInvalid={!!errors.firstName}
					errorMessage={errors.firstName?.message}
					{...register("firstName")}
				/>

				<Input
					radius="sm"
					label="Last Name"
					variant="bordered"
					isInvalid={!!errors.lastName}
					errorMessage={errors.lastName?.message}
					{...register("lastName")}
				/>
			</div>

			<Textarea
				radius="sm"
				label="Bio"
				variant="bordered"
				minRows={3}
				maxRows={6}
				isInvalid={!!errors.bio}
				errorMessage={errors.bio?.message}
				{...register("bio")}
				placeholder="Tell us about yourself..."
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Input
					radius="sm"
					label="City"
					variant="bordered"
					isInvalid={!!errors.city}
					errorMessage={errors.city?.message}
					{...register("city")}
				/>

				<Input
					radius="sm"
					label="Country"
					variant="bordered"
					isInvalid={!!errors.country}
					errorMessage={errors.country?.message}
					{...register("country")}
				/>
			</div>
		</div>
	);
}
