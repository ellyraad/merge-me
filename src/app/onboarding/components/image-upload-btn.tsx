/** biome-ignore-all lint/style/noNonNullAssertion: uploadOptions are explicitly defined  */

"use client";

import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import {
	CldUploadButton,
	type CloudinaryUploadWidgetOptions,
	type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { addImage } from "@/app/actions/image-actions";
import type { OnboardingSchema } from "@/lib/schemas";

export function ImageUploadButton({
	isUploading,
	onUploadingChange,
	setValue,
}: {
	isUploading?: boolean;
	onUploadingChange(uploading: boolean): void;
	setValue(value: OnboardingSchema["photo"]): void;
}) {
	const uploadOptions: CloudinaryUploadWidgetOptions = {
		maxFiles: 1,
		clientAllowedFormats: ["jpg", "png"],
		maxFileSize: 2_200_000, // in bytes
		styles: {
			frame: {
				background: "#18181BD9",
			},

			palette: {
				window: "#0D1117",
				windowBorder: "#30363D",
				tabIcon: "#58A6FF",
				menuIcons: "#8B949E",
				textDark: "#C9D1D9",
				textLight: "#F0F6FC",
				link: "#2EA043",
				action: "#2EA043",
				inactiveTabIcon: "#6E7681",
				error: "#FF7B72",
				inProgress: "#58A6FF",
				complete: "#238636",
				sourceBg: "#010409",
			},
		},
	};

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
				options={uploadOptions}
			>
				<div>
					<p className="font-bold text-lg">
						{isUploading ? "Uploading" : "Upload"}
					</p>

					<p className="mt-4 text-center text-sm">
						Max. file size:{" "}
						{(uploadOptions.maxFileSize! / 1_000_000).toFixed(1)} MB
					</p>
				</div>
			</CldUploadButton>
		</div>
	);
}
