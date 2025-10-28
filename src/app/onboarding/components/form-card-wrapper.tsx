import { Card, CardBody, CardHeader } from "@heroui/card";

export function FormCardWrapper({
	children,
	title,
}: {
	children?: React.ReactNode;
	title: string;
}) {
	return (
		<Card>
			<CardHeader className="font-bold text-2xl">{title}</CardHeader>

			<CardBody>{children}</CardBody>
		</Card>
	);
}
