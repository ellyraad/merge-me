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

// Discover API types
export type DiscoverUser = {
	id: string;
	firstName: string;
	lastName: string;
	city: string;
	country: string;
	bio: string;
	photo: {
		url: string;
		publicId: string;
	} | null;
	programmingLanguages: Array<{
		id: string;
		name: string;
	}>;
	jobTitles: Array<{
		id: string;
		name: string;
	}>;
};

// Swipe API types
export type SwipeResponse = {
	swipe: {
		id: string;
		type: "LIKE" | "PASS";
		createdAt: string;
	};
	match?: {
		id: string;
		createdAt: string;
	};
};

// Match API types
export type MatchUser = {
	id: string;
	firstName: string;
	lastName: string;
	city: string | null;
	country: string | null;
	bio: string;
	photo: {
		url: string;
	} | null;
	programmingLanguages: Array<{
		id: string;
		name: string;
	}>;
	jobTitles: Array<{
		id: string;
		name: string;
	}>;
};

export type Match = {
	id: string;
	createdAt: string;
	user: MatchUser;
};

export type MatchesResponse = {
	matches: Match[];
	total: number;
	limit: number;
	offset: number;
};
