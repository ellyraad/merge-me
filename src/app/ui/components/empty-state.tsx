import type { ReactNode } from "react";

interface EmptyStateProps {
	title: string;
	description?: string;
	icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-foreground-200 border-dashed py-16">
			{icon}
			<p className="text-foreground-500 text-xl">{title}</p>
			{description && (
				<p className="max-w-md text-center text-foreground-400 text-sm">
					{description}
				</p>
			)}
		</div>
	);
}
