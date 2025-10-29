import { CardStacks } from "@/app/ui/components/swipe-card/swipe-card";

export default function DiscoverPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-start">
			<div className="w-full text-center text-gray-200/70">
				<h1 className="font-bold text-lg">Match with your fellow nerds</h1>

				<p className="">
					Swipe right to approve their pull request, swipe left to close it.
				</p>
			</div>

			<CardStacks />
		</main>
	);
}
