"use client";
import { Hero, Text } from "@primer/react-brand";
import { HiHeart } from "react-icons/hi";

export default function HeroSection() {
	return (
		<div
			className="min-h-dvh bg-center bg-cover bg-no-repeat"
			style={{ backgroundImage: "url('/hero-bg.png')" }}
		>
			<Hero align="center">
				<Hero.Heading>
					<Text size="1000" className="flex items-center gap-4">
						LGTM <HiHeart className="mb-2 md:mb-6" />
					</Text>
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
