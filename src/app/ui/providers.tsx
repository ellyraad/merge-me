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
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const colorMode = (
		resolvedTheme === "dark" || resolvedTheme === "light"
			? resolvedTheme
			: "light"
	) as "light" | "dark";

	const handleSetColorMode = (mode: "light" | "dark") => {
		setTheme(mode);
	};

	if (!mounted) {
		return null;
	}

	return (
		<ColorModeContext.Provider
			value={{ colorMode, setColorMode: handleSetColorMode }}
		>
			<ThemeProvider colorMode={colorMode}>{children}</ThemeProvider>
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
				disableTransitionOnChange
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
