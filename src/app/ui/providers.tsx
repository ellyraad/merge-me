"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider } from "@primer/react-brand";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getQueryClient } from "@/lib/queryclient";
import { ColorModeContext } from "../contexts/colormode";

function ThemeSync({ children }: { children: React.ReactNode }) {
	const { resolvedTheme, setTheme } = useTheme();
	const [colorMode, setColorMode] = useState<"light" | "dark">("light");

	useEffect(() => {
		if (resolvedTheme === "dark" || resolvedTheme === "light") {
			setColorMode(resolvedTheme);
		}
	}, [resolvedTheme]);

	const handleSetColorMode = (mode: "light" | "dark") => {
		setColorMode(mode);
		setTheme(mode);
	};

	return (
		<ColorModeContext.Provider
			value={{ colorMode, setColorMode: handleSetColorMode }}
		>
			<ThemeProvider
				colorMode={colorMode}
				style={{
					backgroundColor: "var(--brand-color-canvas-default)",
					transition: "background-color 0.3s ease",
				}}
			>
				{children}
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<NextThemesProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				storageKey="merge-me-theme"
			>
				<HeroUIProvider>
					<ThemeSync>
						<ToastProvider placement="top-center" />
						{children}
					</ThemeSync>
				</HeroUIProvider>
			</NextThemesProvider>
		</QueryClientProvider>
	);
}
