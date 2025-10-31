import { Avatar } from "@heroui/avatar";

interface UserAvatarProps {
	src: string;
	name: string;
	size?: "sm" | "md" | "lg";
	radius?: "sm" | "md" | "lg" | "full";
}

export function UserAvatar({
	src,
	name,
	size = "lg",
	radius = "full",
}: UserAvatarProps) {
	return (
		<Avatar src={src} showFallback name={name} radius={radius} size={size} />
	);
}
