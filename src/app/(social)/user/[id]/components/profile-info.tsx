import { Divider } from "@heroui/divider";
import { FiMapPin } from "react-icons/fi";

export function ProgLanguageListItem({ name }: { name: string }) {
	return (
		<div className="rounded-lg border-2 border-green-950 bg-green-950/80 px-3 py-2 font-bold text-sm text-teal-200">
			{name}
		</div>
	);
}

export function UserLocation({
	city,
	country,
}: {
	city: string | null;
	country: string | null;
}) {
	return (
		<p className="flex gap-2 text-left text-md text-teal-400">
			<span className="h-4 w-4">
				<FiMapPin className="mt-1" />
			</span>
			<span>{`${city}, ${country}`}</span>
		</p>
	);
}

type InfoHeaderProps = {
	firstName: string;
	lastName: string;
	jobTitle: string;
	city: string | null;
	country: string | null;
	className?: string;
};
export function InfoHeader({
	firstName,
	lastName,
	jobTitle,
	city,
	country,
	className,
}: InfoHeaderProps) {
	return (
		<div className={className}>
			<h1 className="font-bold text-3xl">{`${firstName} ${lastName}`}</h1>
			<p className="text-lg">{jobTitle}</p>

			<Divider className="my-2" />

			<UserLocation city={city} country={country} />
		</div>
	);
}
