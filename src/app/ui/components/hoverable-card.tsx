import { Card } from "@heroui/card";
import type { ReactNode } from "react";

interface HoverableCardProps {
	children: ReactNode;
	isPressable?: boolean;
	className?: string;
}

export function HoverableCard({
	children,
	isPressable = false,
	className = "",
}: HoverableCardProps) {
	return (
		<Card
			isPressable={isPressable}
			className={`rounded-md border-1 border-gray-100 bg-surface-1-l/20 px-5 py-4 hover:border-gray-200 hover:bg-surface-1-l dark:border-gray-700 dark:bg-surface-1-d dark:hover:bg-surface-2-d ${className}`}
		>
			{children}
		</Card>
	);
}
