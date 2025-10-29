import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { Logo } from "@/app/ui/base/logo";
import FooterLinkGroup from "./footer-link-group";

export default function FooterSection() {
	const productLinks = [
		{ url: "#features", text: "Features" },
		{ url: "#about", text: "About" },
	];

	const resourcesLinks = [
		{ url: "#", text: "Blog" },
		{ url: "#", text: "Support" },
	];

	return (
		<footer className="w-full bg-content1 py-12">
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand Section */}
					<div className="space-y-3">
						<div className="flex gap-2">
							<Link
								color="foreground"
								className="flex flex-col gap-5 font-bold text-2xl"
								href="/"
							>
								<Logo width={80} height={80} />
								<span>MergeMe</span>
							</Link>
						</div>
						<p className="text-default-500 text-sm">
							Submit your <span className="line-through">love</span> pull
							request
						</p>
					</div>

					<FooterLinkGroup title="Products" links={productLinks} />
					<FooterLinkGroup title="Resources" links={resourcesLinks} />
				</div>

				<Divider className="my-8" />

				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<p className="text-default-400 text-sm">
						© {new Date().getFullYear()} MergeMe. All rights reserved.
					</p>

					{/* Social Links */}
					<div className="flex gap-4">
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
				</div>
			</div>
		</footer>
	);
}
