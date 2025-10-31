export type ProgrammingLanguage = {
	id: string;
	name: string;
};

export type JobTitle = {
	id: string;
	name: string;
};

export type UserPhoto = {
	url: string;
	publicId: string;
};

export type UserPhotoMinimal = {
	url: string;
};

export type UserTags = {
	programmingLanguages: ProgrammingLanguage[];
	jobTitles: JobTitle[];
};
