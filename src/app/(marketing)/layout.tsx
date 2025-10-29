import { PublicNavbar } from "../ui/components/navbar/public-navbar";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main>
			<PublicNavbar />
			{children}
		</main>
	);
}
