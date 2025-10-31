"use client";

import { Hero } from "@primer/react-brand";
import Image from "next/image";
import { HiHeart } from "react-icons/hi";
import heroBg from "../../../../public/hero-bg.png";

export default function HeroSection() {
	return (
		<div className="relative min-h-dvh">
			<Image
				src={heroBg}
				alt="Hero background"
				fill
				priority
				className="object-cover"
				quality={90}
				placeholder="blur"
			/>
			<div className="relative z-10">
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
		</div>
	);
}
