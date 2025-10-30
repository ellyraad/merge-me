"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider } from "@primer/react-brand";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { getQueryClient } from "@/lib/queryclient";
import { ColorModeContext } from "../contexts/colormode";

export function Providers({ children }: { children: React.ReactNode }) {
	const [colorMode, setColorMode] = useState<"light" | "dark">("dark");

	useEffect(() => {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setColorMode("dark");
		}
	}, []);

	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ColorModeContext.Provider value={{ colorMode, setColorMode }}>
				<NextThemesProvider
					attribute="class"
					defaultTheme={colorMode}
					value={{
						light: "light",
						dark: "dark",
					}}
				>
					<HeroUIProvider>
						<ThemeProvider
							colorMode={colorMode}
							style={{
								backgroundColor: "var(--brand-color-canvas-default)",
								transition: "background-color 0.3s ease",
							}}
						>
							<ToastProvider placement="top-center" />
							{children}
						</ThemeProvider>
					</HeroUIProvider>
				</NextThemesProvider>
			</ColorModeContext.Provider>
		</QueryClientProvider>
	);
}
