import type { Metadata } from "next";
import { geistMono, monaSans } from "@/fonts";
import "./globals.css";
import Footer from "./ui/components/footer";
import { Providers } from "./ui/providers";

export const metadata: Metadata = {
	title: "MergeMe",
	description: "LGTM ❤️",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${monaSans.variable} ${geistMono.variable} bg-background-light antialiased dark:bg-background-dark`}
			>
				<Providers>
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
