import { ConversationListItem } from "./components/conversation-list-item";

export default function MessagesPage() {
	return (
		<main>
			<ConversationListItem
				imageUrl="https://ui-avatars.com/api/?name=Alice&background=0D8ABC&color=fff"
				name="Alice Santos"
				lastMessage="Hello, world!"
			/>
		</main>
	);
}
