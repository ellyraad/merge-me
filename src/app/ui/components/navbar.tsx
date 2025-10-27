"use client";

import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@primer/react-brand";
import { ThemeSwitcher } from "../base/theme-switcher";

export function NavBar() {
	return (
		<Navbar className="dark:bg-background">
			<NavbarBrand>
				<p className="font-bold text-inherit">MergeMe</p>
			</NavbarBrand>
			<NavbarContent className="hidden gap-4 sm:flex" justify="center">
				<NavbarItem>
					<Link color="foreground" href="#">
						About
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						FAQs
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Contact
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>
					<Button as="a" href="/login" variant="primary" size="small">
						Login
					</Button>
				</NavbarItem>

				<NavbarItem>
					<ThemeSwitcher />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
