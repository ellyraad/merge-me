"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@primer/react-brand";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa6";
import { type LoginDataSchema, loginDataSchema } from "@/lib/schemas";

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginDataSchema),
		mode: "onTouched",
	});

	// TODO: implement server action for login first
	const onSubmit: SubmitHandler<LoginDataSchema> = (data: LoginDataSchema) =>
		console.log(data);

	return (
		<Card className="-mt-20 mx-auto w-3/5 md:w-1/3">
			<CardHeader>
				<div className="mx-auto flex w-fit items-center gap-2 text-center">
					<FaLock size={20} /> <span className="font-bold text-2xl">Login</span>
				</div>
			</CardHeader>

			<Divider />

			<CardBody className="px-5 py-5">
				<form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-5">
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
							type="password"
							isInvalid={!!errors.email}
							errorMessage={!!errors.email?.message}
							{...register("password")}
						/>
					</div>

					<Button type="submit" variant="primary">
						Login
					</Button>
				</form>
			</CardBody>
		</Card>
	);
}
