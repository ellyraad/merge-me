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
