import type { UserPhoto, UserPhotoMinimal, UserTags } from "./shared.types";

export type BaseUser = {
	id: string;
	firstName: string;
	lastName: string;
	bio: string;
	city: string | null;
	country: string | null;
};

export type PublicUserProfile = BaseUser &
	UserTags & {
		photo: UserPhoto | null;
	};

export type FullUserProfile = PublicUserProfile & {
	email?: string;
	createdAt: string;
	doneOnboarding?: boolean;
	match?: {
		matchId: string;
	} | null;
};

export type DiscoverUser = PublicUserProfile;
export type MatchUser = PublicUserProfile;

export type ConversationUser = Pick<
	BaseUser,
	"id" | "firstName" | "lastName"
> & {
	photo: UserPhotoMinimal | null;
};

export type AuthUserPhoto = UserPhoto & {
	id: string;
	userId: string;
};
