"use client";

import { Button, Divider, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { registerUser } from "@/app/actions/auth-actions";
import EyeFilledIcon from "@/app/ui/base/eye-filled-icon";
import EyeSlashFilledIcon from "@/app/ui/base/eye-slash-filled-icon";
import { type RegisterDataSchema, registerDataSchema } from "@/lib/schemas";
import { handleFormSubmitResult } from "@/lib/utils";

export default function RegisterForm() {
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterDataSchema>({
		resolver: zodResolver(registerDataSchema),
		mode: "onTouched",
	});

	const router = useRouter();
	const onSubmit: SubmitHandler<RegisterDataSchema> = async (
		data: RegisterDataSchema,
	) => {
		const fetchResult = await registerUser(data);
		const result = handleFormSubmitResult(
			fetchResult,
			"Account successfully created",
		);

		if (result) {
			router.push("/login");
		}
	};

	return (
		<form
			className="flex w-full max-w-md flex-col gap-8 sm:max-w-lg md:max-w-xl"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex flex-col gap-5">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<Input
						isRequired
						radius="sm"
						label="First Name"
						placeholder=""
						type="text"
						variant="flat"
						isInvalid={!!errors.firstName}
						errorMessage={errors.firstName?.message}
						{...register("firstName")}
					/>
					<Input
						isRequired
						label="Last Name"
						placeholder=""
						type="text"
						variant="flat"
						radius="sm"
						isInvalid={!!errors.lastName}
						errorMessage={errors.lastName?.message}
						{...register("lastName")}
					/>
				</div>

				<Divider className="block sm:hidden" />

				<Input
					isRequired
					radius="sm"
					label="Email"
					type="email"
					variant="flat"
					isInvalid={!!errors.email}
					errorMessage={errors.email?.message}
					{...register("email")}
				/>

				<Input
					radius="sm"
					isRequired
					variant="flat"
					label="Password"
					type={isVisible ? "text" : "password"}
					isInvalid={!!errors.password}
					errorMessage={errors.password?.message}
					{...register("password")}
					endContent={
						<button
							aria-label="toggle password visibility"
							className="outline-transparent focus:outline-solid"
							type="button"
							onClick={toggleVisibility}
						>
							{isVisible ? (
								<EyeSlashFilledIcon className="pointer-events-none mb-1 text-2xl text-default-400" />
							) : (
								<EyeFilledIcon className="pointer-events-none mb-1 text-2xl text-default-400" />
							)}
						</button>
					}
				/>
			</div>

			<Button
				type="submit"
				size="md"
				color="success"
				className="rounded-sm bg-gh-green-300 text-white"
				isLoading={isSubmitting}
			>
				Sign Up
			</Button>
		</form>
	);
}
