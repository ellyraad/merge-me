import type { Metadata } from "next";
import { geistMono, monaSans } from "@/fonts";
import "./globals.css";

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
				{children}
			</body>
		</html>
	);
}
