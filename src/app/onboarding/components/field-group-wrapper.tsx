type Props = {
	children: React.ReactNode;
	layout?: "row" | "column";
	title: string;
};

export function FieldGroupWrapper({ children, layout = "row", title }: Props) {
	return (
		<div className="mt-6">
			<p className="font-bold">{title}</p>
			<div
				className={`mt-4 flex gap-4 ${layout === "row" ? "max-md:flex-wrap" : "flex-col"}`}
			>
				{children}
			</div>
		</div>
	);
}
