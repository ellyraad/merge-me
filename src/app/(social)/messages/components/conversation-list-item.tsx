import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/user";

export function ConversationListItem({
	imageUrl,
	name,
	lastMessage,
}: {
	imageUrl: string;
	name: string;
	lastMessage: string;
}) {
	return (
		<Card className="bg-gray-900/60" isPressable fullWidth>
			<CardBody>
				<div className="flex w-full rounded-2xl px-2 py-2">
					<User
						isFocusable
						avatarProps={{
							src: imageUrl,
							size: "lg",
						}}
						name={<p className="text-lg">{name}</p>}
						description={
							<p className="font-bold text-foreground text-lg">{lastMessage}</p>
						}
					/>
				</div>
			</CardBody>
		</Card>
	);
}
