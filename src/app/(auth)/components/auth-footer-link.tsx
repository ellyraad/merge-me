import Link from "next/link";

interface AuthFooterLinkProps {
	text: string;
	linkText: string;
	linkHref: string;
}

export function AuthFooterLink({
	text,
	linkText,
	linkHref,
}: AuthFooterLinkProps) {
	return (
		<div>
			<p>
				{text}{" "}
				<Link href={linkHref} className="underline underline-offset-2">
					{linkText}
				</Link>{" "}
			</p>
		</div>
	);
}
