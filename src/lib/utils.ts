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
