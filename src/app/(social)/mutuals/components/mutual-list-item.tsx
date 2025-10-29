import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@heroui/user";
import { FaComment } from "react-icons/fa";

export function MutualListItem({
	imageUrl,
	name,
	jobTitle,
}: {
	imageUrl: string;
	name: string;
	jobTitle: string;
}) {
	return (
		<Card>
			<CardBody>
				<div className="flex items-center justify-between">
					<User
						isFocusable
						avatarProps={{
							src: imageUrl,
							size: "lg",
						}}
						description={<p className="text-gray-400 text-lg">{jobTitle}</p>}
						name={<p className="font-bold text-lg">{name}</p>}
					/>

					<Tooltip color="default" content="Start Chat" closeDelay={0}>
						<Button
							isIconOnly
							variant="flat"
							color="success"
							radius="lg"
							className="bg-green-800 px-2"
						>
							<FaComment className="text-white" size={26} />
						</Button>
					</Tooltip>
				</div>
			</CardBody>
		</Card>
	);
}
