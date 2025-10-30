export function UserNotFoundFallback() {
	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-danger border-dashed py-16">
				<p className="text-danger text-xl">User not found</p>
				<p className="text-foreground-400 text-sm">
					The user you're looking for doesn't exist or has been removed.
				</p>
			</div>
		</div>
	);
}
