"use client";
import { Hero, Text } from "@primer/react-brand";
import { HiHeart } from "react-icons/hi";

export default function HeroSection() {
	return (
		<div
			style={{
				backgroundImage: "url('/hero-bg.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
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
