"use client";

import Link from "next/link";
import { FaCode, FaHome } from "react-icons/fa";

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-background-light px-4 dark:bg-background-dark">
			<div className="mx-auto max-w-2xl text-center">
				<div className="mb-8 flex justify-center">
					<div className="relative">
						<FaCode className="text-9xl text-foreground-200" />
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="font-bold text-5xl text-gh-green-300">404</span>
						</div>
					</div>
				</div>

				<h1 className="mb-4 font-bold text-4xl md:text-5xl">Page Not Found</h1>

				<p className="mb-8 text-foreground-500 text-lg">
					Looks like this pull request got lost in the merge conflict. The page
					you're looking for doesn't exist or has been moved.
				</p>

				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link
						href="/"
						className="flex items-center gap-2 rounded-lg bg-gh-green-300 px-6 py-3 font-semibold text-white transition-colors hover:bg-gh-green-200"
					>
						<FaHome />
						Go Home
					</Link>
					<button
						type="button"
						onClick={() => window.history.back()}
						className="flex items-center gap-2 rounded-lg border border-foreground-300 px-6 py-3 font-semibold text-foreground-700 transition-colors hover:bg-foreground-100 dark:border-foreground-600 dark:text-foreground-300 dark:hover:bg-foreground-900"
					>
						Go Back
					</button>
				</div>

				<div className="mt-12 text-foreground-400 text-sm">
					<p>
						If you believe this is an error, please{" "}
						<Link
							href="https://github.com/ellyraad/merge-me/issues"
							className="text-gh-green-300 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							report an issue
						</Link>
						.
					</p>
				</div>
			</div>
		</main>
	);
}
