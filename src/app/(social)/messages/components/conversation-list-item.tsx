import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { User } from "@heroui/user";
import Link from "next/link";

interface ConversationListItemProps {
	conversationId: string;
	imageUrl: string;
	name: string;
	lastMessage: string | null;
	lastMessageTime?: Date;
	unreadCount?: number;
}

function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) {
		return "Just now";
	}
	if (diffMins < 60) {
		return `${diffMins}m ago`;
	}
	if (diffHours < 24) {
		return `${diffHours}h ago`;
	}
	if (diffDays < 7) {
		return `${diffDays}d ago`;
	}
	return date.toLocaleDateString();
}

export function ConversationListItem({
	conversationId,
	imageUrl,
	name,
	lastMessage,
	lastMessageTime,
	unreadCount = 0,
}: ConversationListItemProps) {
	return (
		<Link href={`/messages/${conversationId}`}>
			<Card className="bg-gray-900/60" isPressable fullWidth>
				<CardBody>
					<div className="flex w-full items-center justify-between gap-3 rounded-2xl px-2 py-2">
						<User
							isFocusable
							avatarProps={{
								src: imageUrl,
								size: "lg",
							}}
							name={<p className="text-lg">{name}</p>}
							description={
								<p
									className={`text-sm ${unreadCount > 0 ? "font-bold text-foreground" : "text-foreground-500"}`}
								>
									{lastMessage || "No messages yet"}
								</p>
							}
						/>
						<div className="flex flex-col items-end gap-1">
							{lastMessageTime && (
								<p className="text-foreground-400 text-xs">
									{formatRelativeTime(lastMessageTime)}
								</p>
							)}
							{unreadCount > 0 && (
								<Chip color="primary" size="sm" variant="flat">
									{unreadCount}
								</Chip>
							)}
						</div>
					</div>
				</CardBody>
			</Card>
		</Link>
	);
}
