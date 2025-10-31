"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaBug, FaHome, FaRedo } from "react-icons/fa";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-background-light px-4 dark:bg-background-dark">
			<div className="mx-auto max-w-2xl text-center">
				<div className="mb-8 flex justify-center">
					<div className="rounded-full bg-danger/10 p-8">
						<FaBug className="text-6xl text-danger" />
					</div>
				</div>

				<h1 className="mb-4 font-bold text-4xl md:text-5xl">
					Oops! Something Went Wrong
				</h1>

				<p className="mb-6 text-foreground-500 text-lg">
					We encountered an unexpected error. Don't worry, our team has been
					notified and we're working on fixing it.
				</p>

				{process.env.NODE_ENV === "development" && (
					<div className="mb-8 rounded-lg bg-foreground-100 p-4 text-left dark:bg-foreground-900">
						<p className="mb-2 font-semibold">Error Details:</p>
						<code className="block overflow-x-auto text-danger text-sm">
							{error.message}
						</code>
						{error.digest && (
							<p className="mt-2 text-foreground-500 text-xs">
								Error ID: {error.digest}
							</p>
						)}
					</div>
				)}

				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<button
						type="button"
						onClick={reset}
						className="flex items-center gap-2 rounded-lg bg-gh-green-300 px-6 py-3 font-semibold text-white transition-colors hover:bg-gh-green-200"
					>
						<FaRedo />
						Try Again
					</button>
					<Link
						href="/"
						className="flex items-center gap-2 rounded-lg border border-foreground-300 px-6 py-3 font-semibold text-foreground-700 transition-colors hover:bg-foreground-100 dark:border-foreground-600 dark:text-foreground-300 dark:hover:bg-foreground-900"
					>
						<FaHome />
						Go Home
					</Link>
				</div>

				<div className="mt-12 text-foreground-400 text-sm">
					<p>
						Need help?{" "}
						<Link
							href="https://github.com/ellyraad/merge-me/issues"
							className="text-gh-green-300 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Report this issue
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
