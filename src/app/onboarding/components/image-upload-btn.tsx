/** biome-ignore-all lint/style/noNonNullAssertion: uploadOptions are explicitly defined  */

"use client";

import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import {
	CldUploadButton,
	type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { addImage } from "@/app/actions/image-actions";
import type { OnboardingSchema } from "@/lib/schemas";
import { cloudinaryWidgetOptions } from "@/lib/utils";

export function ImageUploadButton({
	isUploading,
	onUploadingChange,
	setValue,
}: {
	isUploading?: boolean;
	onUploadingChange(uploading: boolean): void;
	setValue(value: OnboardingSchema["photo"]): void;
}) {
	const router = useRouter();
	const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
		try {
			if (result.info && typeof result.info === "object") {
				await addImage(result.info.secure_url, result.info.public_id);
				setValue?.({
					url: result.info.secure_url,
					publicId: result.info.public_id,
				});
				addToast({
					title: "Image uploaded successfully!",
					color: "success",
				});

				router.refresh();
			} else {
				addToast({
					title: "Failed to upload image. Try again.",
					color: "danger",
				});
			}
		} catch (error) {
			console.error("onAddImage error:", error);
			addToast({ title: "Upload failed", color: "danger" });
		} finally {
			onUploadingChange?.(false);
		}
	};

	return (
		<div>
			<CldUploadButton
				onClick={() => onUploadingChange?.(true)}
				onClose={() => onUploadingChange?.(false)}
				onSuccess={onAddImage}
				className={`w-full rounded-lg border-1 border-green-600 py-2 text-lg ${isUploading ? "opacity-50" : "bg-green-800"}`}
				uploadPreset={process.env.CLOUDINARY_UPLOAD_PRESET}
				signatureEndpoint="/api/images/signature"
				options={cloudinaryWidgetOptions}
			>
				<div>
					<p className="font-bold text-lg">
						{isUploading ? "Uploading" : "Upload"}
					</p>

					<p className="mt-4 text-center text-sm">
						Max. file size:{" "}
						{(cloudinaryWidgetOptions.maxFileSize! / 1_000_000).toFixed(1)} MB
					</p>
				</div>
			</CldUploadButton>
		</div>
	);
}
