import Image from "next/image";
import heroBg from "../../../public/hero-bg.png";

export default function RegisterPage({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="relative flex min-h-screen items-center justify-center">
			<Image
				src={heroBg}
				alt="Background"
				fill
				priority
				className="object-cover"
				quality={90}
				placeholder="blur"
			/>
			<div className="relative z-10">{children}</div>
		</main>
	);
}
