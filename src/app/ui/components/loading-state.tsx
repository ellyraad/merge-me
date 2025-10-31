import { Spinner } from "@heroui/spinner";

interface LoadingStateProps {
	size?: "sm" | "md" | "lg";
}

export function LoadingState({ size = "lg" }: LoadingStateProps) {
	return (
		<div className="container mx-auto flex max-w-3xl items-center justify-center px-4 py-8">
			<Spinner size={size} />
		</div>
	);
}
