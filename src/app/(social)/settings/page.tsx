"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { deleteUserAccount, signOutUser } from "@/app/actions/auth-actions";
import { useColorMode } from "@/app/contexts/colormode";
import { ConfirmationModal } from "@/app/ui/components/confirmation-modal";

export default function SettingsPage() {
	const { setTheme, resolvedTheme } = useTheme();
	const { setColorMode } = useColorMode();
	const [mounted, setMounted] = useState(false);
	const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => setMounted(true), []);

	const handleThemeChange = (keys: "all" | Set<React.Key>) => {
		if (keys === "all") return;

		const selectedKey = Array.from(keys)[0] as string;
		if (selectedKey === "light" || selectedKey === "dark") {
			setTheme(selectedKey);
			setColorMode(selectedKey);
		}
	};

	const handleSignOut = async () => {
		try {
			setIsSigningOut(true);
			await signOutUser();
		} catch (error) {
			console.error("Error signing out:", error);
			setIsSigningOut(false);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			setIsDeleting(true);
			await deleteUserAccount();
		} catch (error) {
			console.error("Error deleting account:", error);
			setIsDeleting(false);
		}
	};

	if (!mounted) {
		return (
			<main className="container mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
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
		<main className="container mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
			<div className="flex items-center justify-between gap-4 border-b-1 border-b-gray-700 pb-3">
				<h2 className="font-bold text-lg">Theme</h2>

				<Select
					fullWidth={false}
					radius="sm"
					variant="bordered"
					selectedKeys={resolvedTheme ? [resolvedTheme] : ["light"]}
					onSelectionChange={handleThemeChange}
				>
					<SelectItem key="light">Light</SelectItem>
					<SelectItem key="dark">Dark</SelectItem>
				</Select>
			</div>

			<div className="flex items-center justify-between gap-4 border-b-1 border-b-gray-700 pb-3">
				<h2 className="font-bold text-lg">Account</h2>

				<Button
					color="danger"
					variant="faded"
					size="md"
					radius="sm"
					onPress={() => setIsSignOutModalOpen(true)}
				>
					Sign Out
				</Button>
			</div>

			<div>
				<h2 className="border-b-1 border-b-gray-700 pb-3 font-bold text-lg">
					Advanced
				</h2>

				<div className="mt-2 flex justify-between gap-6">
					<p>
						Permanently delete your account and all associated data. This action
						cannot be undone.
					</p>

					<div>
						<Button
							variant="faded"
							size="md"
							radius="sm"
							className="bg-red-700 text-white"
							onPress={() => setIsDeleteModalOpen(true)}
						>
							Delete account
						</Button>
					</div>
				</div>
			</div>

			<Modal
				isOpen={isSignOutModalOpen}
				onClose={() => setIsSignOutModalOpen(false)}
				onConfirm={handleSignOut}
				title="Confirm Sign Out"
				description="Are you sure you want to sign out?"
				confirmLabel="Sign Out"
				confirmColor="primary"
				isLoading={isSigningOut}
			/>

			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteAccount}
				title="Delete Account"
				description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
				confirmLabel="Delete Account"
				confirmColor="danger"
				isLoading={isDeleting}
			/>
		</main>
	);
}
