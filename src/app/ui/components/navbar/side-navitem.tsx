"use client";

import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import type { MenuItem } from "@/lib/types";

export function SideNavItem(props: MenuItem) {
	const pathname = usePathname();

	return (
		<li
			className={`${props.className} ${
				props.href === "/messages" ? "hidden md:block" : ""
			}`}
		>
			<Link
				className={`flex w-full items-center gap-4 rounded-lg border-y-1 border-y-transparent p-5 text-2xl text-foreground hover:bg-gray-900 ${
					pathname === props.href ? "font-bold text-green-400" : ""
				}`}
				href={props.href}
				size="lg"
			>
				{props.icon}
				{props.label}
			</Link>
		</li>
	);
}
