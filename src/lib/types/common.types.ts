import type { z } from "zod";

export type ActionResult<T> =
	| {
			status: "error";
			error: string | z.core.$ZodErrorTree<T>;
	  }
	| {
			status: "success";
			data: T;
	  };

export type MenuItem = {
	label: string;
	href: string;
	className?: string;
	icon: React.ReactNode;
};

export type PaginationParams = {
	limit?: number;
	offset?: number;
};

export type PaginatedResponse<T> = {
	data: T[];
	total: number;
	limit: number;
	offset: number;
};
