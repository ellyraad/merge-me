"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Button } from "@primer/react-brand";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import EyeFilledIcon from "@/app/ui/base/eye-filled-icon";
import EyeSlashFilledIcon from "@/app/ui/base/eye-slash-filled-icon";

export default function RegisterForm() {
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

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
				<form className="flex flex-col gap-8">
					<div className="flex flex-col gap-5">
						<div className="grid grid-cols-2 gap-3">
							<Input
								isRequired
								label="First Name"
								placeholder=""
								type="text"
								variant="bordered"
							/>
							<Input
								isRequired
								label="Last Name"
								placeholder=""
								type="text"
								variant="bordered"
							/>
						</div>

						<Input isRequired label="Email" type="email" variant="bordered" />

						<Input
							isRequired
							variant="bordered"
							label="Password"
							type={isVisible ? "text" : "password"}
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

					<Button type="submit" variant="accent">
						Sign Up
					</Button>
				</form>
			</CardBody>
		</Card>
	);
}
