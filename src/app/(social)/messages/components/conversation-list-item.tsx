import { Avatar } from "@heroui/avatar";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

interface ConversationListItemProps {
	conversationId: string;
	imageUrl: string;
	name: string;
	lastMessage: string | null;
	lastMessageTime?: Date;
	unreadCount?: number;
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
		<Card
			isPressable
			className="rounded-md border-2 border-gray-700 bg-surface-1-d px-5 py-4 hover:border-gh-blue-300"
		>
			<Link
				className="flex items-start gap-6"
				href={`/messages/${conversationId}`}
			>
				<Avatar
					src={imageUrl}
					showFallback
					name={name}
					radius="full"
					size="lg"
				/>

				<div className="flex flex-1 flex-col items-start text-left">
					{/* FIXME: truncate to cater long names/messages */}
					<div className="font-bold text-lg">{name}</div>
					<p>{lastMessage}</p>
				</div>

				<div className="flex flex-col items-end gap-1">
					<p className="text-gray-500 text-sm">
						{/* // biome-ignore lint/style/noNonNullAssertion: this component will not appear without a complete data */}
						{formatRelativeTime(lastMessageTime!)}
					</p>

					{unreadCount > 0 && (
						<Chip color="primary" size="sm" variant="solid">
							{unreadCount}
						</Chip>
					)}
				</div>
			</Link>
		</Card>
	);
}
