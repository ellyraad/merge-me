"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
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

	const onSubmit: SubmitHandler<RegisterDataSchema> = async (
		data: RegisterDataSchema
	) => {
		const result = await registerUser(data);
		handleFormSubmitResult(result, "Account successfully created");
	};

	return (
		<Card className="-mt-20 mx-auto w-3/5 md:w-1/3">
			<CardHeader>
				<div className="mx-auto flex w-fit items-center gap-2 text-center">
					<FaPlus size={20} />{" "}
					<span className="font-bold text-2xl">Signup</span>
				</div>
			</CardHeader>

			<Divider />

			<CardBody className="px-5 py-5">
				<form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-5">
						<div className="grid grid-cols-2 gap-3">
							<Input
								isRequired
								label="First Name"
								placeholder=""
								type="text"
								variant="bordered"
								isInvalid={!!errors.firstName}
								errorMessage={errors.firstName?.message}
								{...register("firstName")}
							/>
							<Input
								isRequired
								label="Last Name"
								placeholder=""
								type="text"
								variant="bordered"
								isInvalid={!!errors.lastName}
								errorMessage={errors.lastName?.message}
								{...register("lastName")}
							/>
						</div>

						<Input
							isRequired
							label="Email"
							type="email"
							variant="bordered"
							isInvalid={!!errors.email}
							errorMessage={errors.email?.message}
							{...register("email")}
						/>

						<Input
							isRequired
							variant="bordered"
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
						isLoading={isSubmitting}
					>
						Sign Up
					</Button>
				</form>
			</CardBody>
		</Card>
	);
}
