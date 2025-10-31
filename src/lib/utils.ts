import { addToast } from "@heroui/toast";
import type { CloudinaryUploadWidgetOptions } from "next-cloudinary";
import type { ActionResult } from "./types";

export const cloudinaryWidgetOptions: CloudinaryUploadWidgetOptions = {
	maxFiles: 1,
	clientAllowedFormats: ["jpg", "png"],
	maxFileSize: 2_200_000,
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

export function handleFormSubmitResult<T>(
	result: ActionResult<T>,
	successMessage: string,
): string | undefined {
	if (result.status === "success") {
		addToast({
			title: successMessage,
			color: "success",
		});
		return "success";
	}

	if (typeof result.error === "string") {
		addToast({
			title: result.error,
			color: "danger",
		});
		return;
	}

	if (result.error.errors) {
		addToast({
			title: result.error.errors[0],
			color: "danger",
		});
		return;
	}
}

export function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) {
		return "Just now";
	}
	if (diffMins < 60) {
		return `${diffMins}m ago`;
	}
	if (diffHours < 24) {
		return `${diffHours}h ago`;
	}
	if (diffDays < 7) {
		return `${diffDays}d ago`;
	}
	return date.toLocaleDateString();
}
