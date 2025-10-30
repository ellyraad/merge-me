import { NextResponse } from "next/server";
import type { ServiceResult } from "@/services";

/**
 * Convert service error to HTTP status code
 */
function getStatusFromError(
	errorType:
		| "NOT_FOUND"
		| "UNAUTHORIZED"
		| "FORBIDDEN"
		| "VALIDATION"
		| "INTERNAL",
): number {
	const statusMap = {
		NOT_FOUND: 404,
		UNAUTHORIZED: 401,
		FORBIDDEN: 403,
		VALIDATION: 400,
		INTERNAL: 500,
	};
	return statusMap[errorType];
}

/**
 * Convert a service result to a Next.js response
 */
export function toResponse<T>(
	result: ServiceResult<T>,
	successStatus = 200,
): NextResponse {
	if (!result.success) {
		return NextResponse.json(
			{ error: result.error.message },
			{ status: getStatusFromError(result.error.type) },
		);
	}

	return NextResponse.json(result.data, { status: successStatus });
}
