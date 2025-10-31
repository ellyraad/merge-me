"use client";

import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import {
	CldUploadButton,
	type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useState } from "react";
import { cloudinaryWidgetOptions as uploadOptions } from "@/lib/utils";

interface ImageUploadSectionProps {
	currentPhotoUrl?: string | null;
	onPhotoChange: (photo: { url: string; publicId: string }) => void;
}

export function ImageUploadSection({
	currentPhotoUrl,
	onPhotoChange,
}: ImageUploadSectionProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);

	const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
		try {
			if (result.info && typeof result.info === "object") {
				const photoData = {
					url: result.info.secure_url,
					publicId: result.info.public_id,
				};
				setPreviewUrl(result.info.secure_url);
				onPhotoChange(photoData);
				addToast({
					title: "Image uploaded successfully!",
					color: "success",
				});
			} else {
				addToast({
					title: "Failed to upload image. Try again.",
					color: "danger",
				});
			}
		} catch (error) {
			console.error("Upload error:", error);
			addToast({ title: "Upload failed", color: "danger" });
		} finally {
			setIsUploading(false);
		}
	};

	const handleWidgetClose = () => {
		setIsUploading(false);
	};

	const handleUploadError = () => {
		setIsUploading(false);
		addToast({
			title: "Upload failed",
			description: "Please try again",
			color: "danger",
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-4 sm:flex-row">
				{previewUrl && (
					<Image
						src={previewUrl}
						alt="Profile photo preview"
						width={120}
						height={120}
						className="mt-3 rounded-lg object-cover"
					/>
				)}

				<CldUploadButton
					onOpen={() => setIsUploading(true)}
					onClose={handleWidgetClose}
					onSuccess={handleUploadSuccess}
					onError={handleUploadError}
					className={`w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
					uploadPreset={process.env.CLOUDINARY_UPLOAD_PRESET}
					signatureEndpoint="/api/images/signature"
					options={uploadOptions}
				>
					{isUploading ? "Uploading..." : "Change Photo"}
				</CldUploadButton>
			</div>
			<p className="text-gray-600 text-sm dark:text-gray-400">
				Max file size: 2.2 MB. Formats: JPG, PNG
			</p>
		</div>
	);
}
