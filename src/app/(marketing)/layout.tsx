import { NavBar } from "../ui/components/navbar";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main>
			<NavBar />
			{children}
		</main>
	);
}
