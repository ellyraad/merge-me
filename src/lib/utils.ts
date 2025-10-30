import { addToast } from "@heroui/toast";
import type { ActionResult } from "./types";

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
