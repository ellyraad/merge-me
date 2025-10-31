import type { JobTitle, ProgrammingLanguage } from "./shared.types";

export type JobTitlesResponse = {
	jobTitles: JobTitle[];
	total: number;
};

export type ProgrammingLanguagesResponse = {
	programmingLanguages: ProgrammingLanguage[];
	total: number;
};
