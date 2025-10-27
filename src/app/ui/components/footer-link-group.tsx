import { Link } from "@heroui/link";

type Props = {
	title: string;
	links: { url: string; text: string }[];
};

export default function FooterLinkGroup({ title, links }: Props) {
	return (
		<div className="space-y-3">
			<h3 className="font-semibold text-sm">{title}</h3>
			<div className="mt-4 flex flex-col gap-2">
				{links.map(l => (
					<Link key={l.text} href={l.url} size="sm" color="foreground">
						{l.text}
					</Link>
				))}
			</div>
		</div>
	);
}
