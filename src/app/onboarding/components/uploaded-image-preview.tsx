import { Spinner } from "@heroui/spinner";
import { CldImage } from "next-cloudinary";
import type { Image } from "@/generated/prisma/client";

export function UploadedImagePreview({
	userImage,
	isUploading = false,
}: {
	userImage?: Image | null;
	isUploading?: boolean;
}) {
	return (
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
					This image will be used when browsing profiles and matching with other
					developers.
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
	);
}
