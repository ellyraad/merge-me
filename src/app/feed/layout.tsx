export default function FeedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="min-h-[900px]">{children}</div>;
}
