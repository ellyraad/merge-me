import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	confirmColor?:
		| "default"
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "danger";
	onConfirm: () => void | Promise<void>;
	isLoading?: boolean;
}

export function ConfirmationModal({
	isOpen,
	onClose,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	confirmColor = "primary",
	onConfirm,
	isLoading = false,
}: ConfirmationModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} placement="center">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
				<ModalBody>
					<p>{description}</p>
				</ModalBody>
				<ModalFooter>
					<Button
						color="default"
						variant="light"
						onPress={onClose}
						isDisabled={isLoading}
					>
						{cancelLabel}
					</Button>
					<Button
						color={confirmColor}
						onPress={onConfirm}
						isLoading={isLoading}
					>
						{confirmLabel}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
