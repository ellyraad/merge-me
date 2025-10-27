import type { Metadata } from "next";
import { geistMono, monaSans } from "@/fonts";
import "./globals.css";
import Footer from "./ui/components/footer";
import { NavBar } from "./ui/components/navbar";
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
				className={`${monaSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<NavBar />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
