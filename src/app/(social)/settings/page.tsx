"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useColorMode } from "@/app/contexts/colormode";

export default function SettingsPage() {
	const { setTheme, resolvedTheme } = useTheme();
	const { setColorMode } = useColorMode();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const handleThemeChange = (keys: "all" | Set<React.Key>) => {
		if (keys === "all") return;

		const selectedKey = Array.from(keys)[0] as string;
		if (selectedKey === "light" || selectedKey === "dark") {
			setTheme(selectedKey);
			setColorMode(selectedKey);
		}
	};

	// Prevent hydration mismatch
	if (!mounted) {
		return (
			<main className="container mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
				<h1 className="font-bold text-3xl">Settings</h1>
				<Card>
					<CardHeader>
						<h2 className="font-semibold text-xl">Appearance</h2>
					</CardHeader>
					<Divider />
					<CardBody className="gap-4">
						<Select
							label="Theme"
							placeholder="Select theme"
							variant="bordered"
							isDisabled
						>
							<SelectItem key="light">Light</SelectItem>
							<SelectItem key="dark">Dark</SelectItem>
						</Select>
					</CardBody>
				</Card>
			</main>
		);
	}

	return (
		<main className="container mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
			<h1 className="font-bold text-3xl">Settings</h1>

			{/* Theme Settings */}
			<Card>
				<CardHeader>
					<h2 className="font-semibold text-xl">Appearance</h2>
				</CardHeader>
				<Divider />
				<CardBody className="gap-4">
					<Select
						label="Theme"
						placeholder="Select theme"
						variant="bordered"
						selectedKeys={resolvedTheme ? [resolvedTheme] : ["light"]}
						onSelectionChange={handleThemeChange}
					>
						<SelectItem key="light">Light</SelectItem>
						<SelectItem key="dark">Dark</SelectItem>
					</Select>
				</CardBody>
			</Card>

			{/* Account Actions */}
			<Card>
				<CardHeader>
					<h2 className="font-semibold text-xl">Account</h2>
				</CardHeader>
				<Divider />
				<CardBody className="gap-4">
					<Button color="primary" variant="solid" size="lg">
						Sign Out
					</Button>
				</CardBody>
			</Card>

			{/* Advanced Settings */}
			<Card>
				<CardHeader>
					<h2 className="font-semibold text-xl">Advanced</h2>
				</CardHeader>
				<Divider />
				<CardBody className="gap-4">
					<div className="flex flex-col gap-2">
						<p className="text-foreground-600 text-sm">
							Permanently delete your account and all associated data. This
							action cannot be undone.
						</p>
						<Button color="danger" variant="solid" size="lg" className="w-fit">
							Delete Account
						</Button>
					</div>
				</CardBody>
			</Card>
		</main>
	);
}
