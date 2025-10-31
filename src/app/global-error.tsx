"use client";

import { useEffect } from "react";
import { FaBug, FaRedo } from "react-icons/fa";

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		console.error("Global application error:", error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<main className="flex min-h-screen flex-col items-center justify-center bg-surface-0-l px-4 dark:bg-surface-0-d">
					<div className="mx-auto max-w-2xl text-center">
						{/* Error Icon */}
						<div className="mb-8 flex justify-center">
							<div className="rounded-full bg-red-100 p-8 dark:bg-red-900/20">
								<FaBug className="text-6xl text-red-600 dark:text-red-400" />
							</div>
						</div>

						<h1 className="mb-4 font-bold text-4xl text-gray-900 md:text-5xl dark:text-white">
							Critical Error
						</h1>

						<p className="mb-6 text-gray-600 text-lg dark:text-gray-400">
							A critical error occurred that prevented the application from
							loading properly. Please try refreshing the page.
						</p>

						{process.env.NODE_ENV === "development" && (
							<div className="mb-8 rounded-lg bg-gray-100 p-4 text-left dark:bg-gray-800">
								<p className="mb-2 font-semibold text-gray-900 dark:text-white">
									Error Details:
								</p>
								<code className="block overflow-x-auto text-red-600 text-sm dark:text-red-400">
									{error.message}
								</code>
								{error.digest && (
									<p className="mt-2 text-gray-500 text-xs dark:text-gray-400">
										Error ID: {error.digest}
									</p>
								)}
							</div>
						)}

						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<button
								type="button"
								onClick={reset}
								className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-500"
							>
								<FaRedo />
								Try Again
							</button>
							<button
								type="button"
								onClick={() => window.location.reload()}
								className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
							>
								Refresh Page
							</button>
						</div>

						<div className="mt-12 text-gray-500 text-sm dark:text-gray-400">
							<p>
								If this problem persists, please{" "}
								<a
									href="https://github.com/ellyraad/merge-me/issues"
									className="text-green-600 hover:underline dark:text-green-400"
									target="_blank"
									rel="noopener noreferrer"
								>
									report this issue
								</a>
								.
							</p>
						</div>
					</div>
				</main>
			</body>
		</html>
	);
}
