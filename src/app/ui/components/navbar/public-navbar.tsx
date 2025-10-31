"use client";

import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@primer/react-brand";
import { Logo } from "../../base/logo";

export function PublicNavbar() {
	return (
		<Navbar className="py-3 dark:bg-background">
			<NavbarBrand>
				<Link
					color="foreground"
					href="/"
					className="flex gap-5 font-bold text-lg"
				>
					<Logo width={40} height={40} />
					<span>MergeMe</span>
				</Link>
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
			</NavbarContent>
		</Navbar>
	);
}
