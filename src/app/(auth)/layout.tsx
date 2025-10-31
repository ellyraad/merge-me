export default function RegisterPage({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main
			className="flex min-h-screen items-center justify-center bg-center bg-cover bg-no-repeat"
			style={{ backgroundImage: "url('/hero-bg.png')" }}
		>
			{children}
		</main>
	);
}
