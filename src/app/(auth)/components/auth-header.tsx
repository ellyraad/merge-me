import { Logo } from "@/app/ui/base/logo";

interface AuthHeaderProps {
	title: string;
}

export function AuthHeader({ title }: AuthHeaderProps) {
	return (
		<div className="flex flex-col items-center gap-6">
			<Logo width={70} height={70} />

			<h1 className="font-bold text-2xl">{title}</h1>
		</div>
	);
}
