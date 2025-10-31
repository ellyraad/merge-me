import type { ReactNode } from "react";

interface ErrorStateProps {
	title: string;
	description?: string;
	action?: ReactNode;
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-danger border-dashed py-16">
			<p className="text-danger text-xl">{title}</p>
			{description && (
				<p className="text-foreground-400 text-sm">{description}</p>
			)}
			{action}
		</div>
	);
}
