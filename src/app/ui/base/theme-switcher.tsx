"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi";
import { useColorMode } from "@/app/contexts/colormode";

export function ThemeSwitcher() {
	const { setTheme, resolvedTheme } = useTheme();
	const { setColorMode } = useColorMode();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const isDark = resolvedTheme === "dark";

	const toggleTheme = () => {
		const newTheme = isDark ? "light" : "dark";
		setTheme(newTheme);
		setColorMode(newTheme);
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="flex items-center gap-2 rounded-full border-1 border-gray-300 p-2 transition-all hover:bg-gray-200 dark:border-teal-800 dark:hover:bg-gray-700"
			aria-label="Toggle theme"
		>
			{isDark ? (
				<HiMoon className="text-shadow-teal-200" size={20} />
			) : (
				<HiSun className="text-gray-900" size={20} />
			)}
		</button>
	);
}
