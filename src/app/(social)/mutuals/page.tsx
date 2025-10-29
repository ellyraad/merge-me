import { Tooltip } from "@heroui/tooltip";

import { MutualListItem } from "./components/mutual-list-item";

export default function MutualsPage() {
	// FIXME: temporary
	const fakeUsers = [
		{
			id: 1,
			name: "Alice",
			avatar:
				"https://ui-avatars.com/api/?name=Alice&background=0D8ABC&color=fff",
		},
		{
			id: 2,
			name: "Bob",
			avatar:
				"https://ui-avatars.com/api/?name=Bob&background=FF6B6B&color=fff",
		},
		{
			id: 3,
			name: "Charlie",
			avatar:
				"https://ui-avatars.com/api/?name=Charlie&background=6C5CE7&color=fff",
		},
		{
			id: 4,
			name: "Diana",
			avatar:
				"https://ui-avatars.com/api/?name=Diana&background=00B894&color=fff",
		},
		{
			id: 5,
			name: "Ethan",
			avatar:
				"https://ui-avatars.com/api/?name=Ethan&background=0984E3&color=fff",
		},
	];

	return (
		<main>
			<h1 className="font-bold text-2xl">
				People who approved your{" "}
				<Tooltip content="Pull Request" closeDelay={0}>
					<span>PR</span>
				</Tooltip>{" "}
			</h1>

			<div className="mt-10 flex flex-col gap-4">
				{fakeUsers.map((user) => (
					<MutualListItem
						key={user.id}
						name={user.name}
						jobTitle="Software Engineer"
						imageUrl={user.avatar}
					/>
				))}
			</div>
		</main>
	);
}
