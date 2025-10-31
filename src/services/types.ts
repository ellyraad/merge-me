export interface PaginationParams {
	limit?: number;
	offset?: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	limit: number;
	offset: number;
}

export interface ServiceError {
	type: "NOT_FOUND" | "UNAUTHORIZED" | "FORBIDDEN" | "VALIDATION" | "INTERNAL";
	message: string;
	details?: unknown;
}

export type ServiceResult<T> =
	| { success: true; data: T }
	| { success: false; error: ServiceError };

export function success<T>(data: T): ServiceResult<T> {
	return { success: true, data };
}

export function error<T>(
	type: ServiceError["type"],
	message: string,
	details?: unknown,
): ServiceResult<T> {
	return { success: false, error: { type, message, details } };
}
