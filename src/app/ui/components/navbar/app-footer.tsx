import { Link } from "@heroui/link";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { Logo } from "../../base/logo";

export function AppFooter() {
	return (
		<div className="lg:8/12 mx-auto w-11/12 flex-col items-center justify-center py-10 sm:flex">
			<div className="flex flex-wrap gap-4 opacity-70">
				<Link href="https://github.com" isExternal color="foreground">
					<FaGithub className="size-5" />
				</Link>
				<Link href="https://twitter.com" isExternal color="foreground">
					<FaTwitter className="size-5" />
				</Link>
				<Link href="https://discord.com" isExternal color="foreground">
					<FaDiscord className="size-5" />
				</Link>
			</div>

			<div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
				<div className="mb-1 flex items-center gap-1">
					<div className="h-6 w-6">
						<Logo
							width={20}
							height={20}
							className="mt-px rounded-full border-1 opacity-50"
						/>
					</div>

					<span>MergeMe</span>
				</div>

				<p className="mb-px text-default-400">
					© {new Date().getFullYear()} MergeMe. All rights reserved.
				</p>
			</div>
		</div>
	);
}
