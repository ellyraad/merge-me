"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type UpdateUserSchema, updateUserSchema } from "@/lib/schemas";
import type { FullUserProfile } from "@/lib/types";
import { EditProfileForm } from "./edit-profile-form";
import { ImageUploadSection } from "./image-upload-section";

interface EditProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: FullUserProfile;
}

export function EditProfileModal({
	isOpen,
	onClose,
	user,
}: EditProfileModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isDirty },
	} = useForm<UpdateUserSchema>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			bio: user.bio || "",
			city: user.city || "",
			country: user.country || "",
		},
		mode: "onTouched",
	});

	const handlePhotoChange = (photo: { url: string; publicId: string }) => {
		setValue("photo", photo, { shouldDirty: true });
	};

	const onSubmit = async (data: UpdateUserSchema) => {
		try {
			setIsSubmitting(true);

			const response = await fetch("/api/users", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to update profile");
			}

			addToast({
				title: "Profile updated successfully!",
				color: "success",
			});

			// Invalidate queries to refetch user data
			await queryClient.invalidateQueries({ queryKey: ["user", user.id] });
			await queryClient.invalidateQueries({ queryKey: ["current-user"] });

			onClose();
		} catch (error) {
			console.error("Error updating profile:", error);
			addToast({
				title: "Failed to update profile",
				description:
					error instanceof Error ? error.message : "Please try again",
				color: "danger",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			placement="center"
			size="2xl"
			scrollBehavior="inside"
			className="h-full w-11/12"
		>
			<ModalContent>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex h-full flex-col"
				>
					<ModalHeader className="flex flex-col gap-1 font-bold text-lg">
						Edit Profile
					</ModalHeader>

					<ModalBody className="">
						<div className="flex flex-col gap-6">
							<div>
								<h3 className="mb-3 font-semibold text-base">Profile Photo</h3>
								<ImageUploadSection
									currentPhotoUrl={user.photo?.url}
									onPhotoChange={handlePhotoChange}
								/>
							</div>

							<Divider />

							<div>
								<h3 className="mb-3 font-semibold text-base">
									Personal Information
								</h3>
								<EditProfileForm register={register} errors={errors} />
							</div>
						</div>
					</ModalBody>

					<ModalFooter className="shrink-0">
						<Button
							color="danger"
							variant="light"
							onPress={onClose}
							isDisabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							color="success"
							type="submit"
							isLoading={isSubmitting}
							isDisabled={!isDirty || isSubmitting}
							className="rounded-sm bg-gh-green-300 text-white"
						>
							Save Changes
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
