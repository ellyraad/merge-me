"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { signInUser } from "@/app/actions/auth-actions";
import { type LoginDataSchema, loginDataSchema } from "@/lib/schemas";
import { handleFormSubmitResult } from "@/lib/utils";

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(loginDataSchema),
		mode: "onTouched",
	});

	const router = useRouter();
	const onSubmit: SubmitHandler<LoginDataSchema> = async (
		data: LoginDataSchema,
	) => {
		const authResult = await signInUser(data);
		handleFormSubmitResult(authResult, "Signed in successfully");
		if (authResult.status === "success") {
			if (
				typeof authResult.data === "object" &&
				authResult.data.doneOnboarding
			) {
				router.push("/discover");
			} else {
				router.push("/onboarding");
			}
		}
	};

	return (
		<form
			className="flex w-full max-w-md flex-col gap-8 sm:max-w-lg md:max-w-xl"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex flex-col gap-5">
				<Input
					radius="sm"
					isRequired
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
					type="password"
					isInvalid={!!errors.password}
					errorMessage={!!errors.password?.message}
					{...register("password")}
				/>
			</div>

			<Button
				radius="sm"
				className="rounded-sm bg-gh-green-300 text-white"
				type="submit"
				color="success"
				isLoading={isSubmitting}
			>
				Login
			</Button>
		</form>
	);
}
