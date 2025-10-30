"use client";

import { Skeleton } from "@heroui/skeleton";
import { Grid } from "@primer/react-brand";

export function OnboardingFormSkeleton() {
	return (
		<div className="my-10">
			<Grid fullWidth className="wrap">
				<Grid.Column
					as="div"
					span={{ xsmall: 12, medium: 6 }}
					className="flex h-fit flex-col gap-3 rounded-lg bg-gray-900/50 p-4"
				>
					<Skeleton className="rounded-2xl">
						<div className="h-40 rounded-lg bg-default-300/40 md:h-60" />
					</Skeleton>

					<Skeleton className="flex gap-3 rounded-2xl">
						<div className="h-10 rounded-lg bg-default-300/40 md:h-30" />
					</Skeleton>

					<Skeleton className="rounded-2xl">
						<div className="h-10 rounded-lg bg-default-300/40 md:h-30" />
					</Skeleton>

					<Skeleton className="flex gap-3 rounded-2xl">
						<div className="h-40 rounded-lg bg-default-300/40 md:h-60" />
					</Skeleton>
				</Grid.Column>

				<Grid.Column
					as="div"
					span={{ xsmall: 12, medium: 6 }}
					className="flex h-fit flex-col gap-3 rounded-lg bg-gray-900/50 p-4"
				>
					<Skeleton className="rounded-2xl">
						<div className="h-20 rounded-lg bg-default-300 md:h-40" />
					</Skeleton>

					<Skeleton className="rounded-2xl">
						<div className="h-120 rounded-lg bg-default-300 md:h-145" />
					</Skeleton>
				</Grid.Column>
			</Grid>
		</div>
	);
}
