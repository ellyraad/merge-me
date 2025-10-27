"use client";

import { Hero } from "@primer/react-brand";
import { HiHeart } from "react-icons/hi";

export default function HeroSection() {
	return (
		<div
			className="min-h-dvh bg-center bg-cover bg-no-repeat"
			style={{ backgroundImage: "url('/hero-bg.png')" }}
		>
			<Hero align="center">
				<Hero.Heading>
					<span className="mt-20 flex items-center gap-4 text-6xl md:text-9xl">
						LGTM <HiHeart className="mb-2 md:mb-6" />
					</span>
				</Hero.Heading>

				<Hero.Description>
					Submit your <span className="line-through">Love</span> Pull Request
				</Hero.Description>

				<Hero.PrimaryAction variant="accent" size="large" href="/register">
					Create an account
				</Hero.PrimaryAction>
			</Hero>
		</div>
	);
}
