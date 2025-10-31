"use client";

import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuToggle,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { FiChevronRight, FiMessageCircle, FiUser } from "react-icons/fi";
import type { MenuItem } from "@/lib/types";
import { SideNavItem } from "./side-navitem";

export type AppNavbarProps = {
	currUserId?: string;
	topMenuItems: MenuItem[];
	bottomMenuItems: MenuItem[];
	className?: string;
};

export default function AppNavbar({
	currUserId,
	topMenuItems,
	bottomMenuItems,
	className,
}: AppNavbarProps) {
	const pathname = usePathname();
	const navItems = [...topMenuItems, ...bottomMenuItems];
	const currPage = navItems.filter(item => item.href === pathname);

	return (
		<Navbar isBordered maxWidth="full" className={className}>
			<NavbarMenuToggle className="md:hidden" />

			<div className="mx-auto flex w-11/12 items-center md:w-8/12">
				<NavbarContent justify="start" className="gap-5">
					<div className="items-center gap-5 md:flex">
						<NavbarBrand>
							<p className="font-bold text-2xl text-inherit">
								{currPage[0] ? currPage[0].label : ""}
							</p>
						</NavbarBrand>

						<FiChevronRight className="hidden text-2xl text-inherit md:inline-block" />

						<div className="hidden items-center gap-2 md:flex">
							{topMenuItems.map((item, _) => (
								<NavbarItem key={item.label}>
									<Button
										as={Link}
										radius="sm"
										href={item.href}
										variant="light"
										color={undefined}
										className={`font-semibold text-lg ${
											pathname === item.href
												? "text-foreground underline underline-offset-4"
												: "text-foreground/70 hover:text-foreground"
										}`}
									>
										{item.label}
									</Button>
								</NavbarItem>
							))}
						</div>
					</div>
				</NavbarContent>

				<NavbarContent justify="end">
					<NavbarItem>
						<Button
							as={Link}
							href="/messages"
							variant="light"
							isIconOnly
							size="lg"
						>
							<FiMessageCircle size={30} />
						</Button>
					</NavbarItem>
				</NavbarContent>

				<NavbarMenu className="flex flex-col justify-between gap-4 rounded-t-2xl border-1 border-gray-300 bg-gray-100/90 py-6 dark:border-gray-800 dark:bg-gray-950">
					<div>
						{topMenuItems.map(item => (
							<SideNavItem key={item.label} {...item} />
						))}
					</div>

					<div>
						<SideNavItem
							label="Profile"
							href={`/user/${currUserId}`}
							icon={<FiUser size={26} />}
						/>
						{bottomMenuItems.map(item => (
							<SideNavItem key={item.label} {...item} />
						))}
					</div>
				</NavbarMenu>
			</div>
		</Navbar>
	);
}
