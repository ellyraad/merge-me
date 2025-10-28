"use client";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import type { Image } from "@prisma/client";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { deleteUserImage } from "@/app/actions/image-actions";
import type { OnboardingSchema } from "@/lib/schemas";

export function UploadedImagePreview({
	userImage,
	setValue,
	isUploading = false,
}: {
	userImage?: Image | null;
	isUploading?: boolean;
	setValue?: (value: OnboardingSchema["photo"]) => void;
}) {
	const router = useRouter();

	const [isDeleting, setIsDeleting] = useState(false);
	const onDelete = async () => {
		try {
			setIsDeleting(true);

			const res = await fetch("/api/delete-image", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				// biome-ignore lint/style/noNonNullAssertion: guaranteed to exist if delete button is shown since userImage?.publicId is checked
				body: JSON.stringify({ publicId: userImage!.publicId }),
			});
			if (!res.ok) throw new Error("Cloudinary delete failed");

			await deleteUserImage();
			setValue?.({ url: "", publicId: "" });
			router.refresh();
		} catch (error) {
			console.error("Failed to delete image:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div>
			<div className="relative flex h-[500] w-[300] items-center overflow-hidden rounded-2xl border-1 border-gray-600">
				{userImage?.publicId ? (
					<CldImage
						width={300}
						height={500}
						src={userImage.publicId}
						alt="Uploaded profile"
						className="h-full w-full rounded-2xl object-cover"
						quality="auto"
						crop="fill"
					/>
				) : (
					<p className="py-4 text-center">
						This image will be used when browsing profiles and matching with
						other developers.
					</p>
				)}

				{isUploading && (
					<div className="absolute inset-0 z-50 flex items-center justify-center bg-background">
						<div className="flex flex-col items-center gap-2 text-white">
							<Spinner size="lg" aria-hidden />
							<p>Uploading…</p>
						</div>
					</div>
				)}
			</div>

			{userImage?.publicId && (
				<Button
					color="danger"
					className="mt-4"
					fullWidth
					variant="bordered"
					onPress={() => onDelete()}
					disabled={isDeleting}
					isLoading={isDeleting}
				>
					<FaTrash /> Delete
				</Button>
			)}
		</div>
	);
}
