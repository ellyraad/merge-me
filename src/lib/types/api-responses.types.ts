import type { JobTitle, ProgrammingLanguage } from "@prisma/client";

export type JobTitlesResponse = {
	jobTitles: JobTitle[];
	total: number;
};

export type ProgrammingLanguagesResponse = {
	programmingLanguages: ProgrammingLanguage[];
	total: number;
};
