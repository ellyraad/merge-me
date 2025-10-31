import type { MatchUser } from "./user.types";

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
