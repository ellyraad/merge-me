import type { z } from "zod";

export type ActionResult<T> =
	| {
			status: "error" | "success";
			error: string | z.core.$ZodErrorTree<T>;
	  }
	| {
			status: "error" | "success";
			data: T;
	  };
