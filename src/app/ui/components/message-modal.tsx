"use client";

import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { useState } from "react";

interface MessageModalProps {
	isOpen: boolean;
	onClose: () => void;
	recipientName: string;
	onSend: (message: string) => Promise<void>;
}

export function MessageModal({
	isOpen,
	onClose,
	recipientName,
	onSend,
}: MessageModalProps) {
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSend = async () => {
		if (!message.trim()) {
			return;
		}

		try {
			setIsLoading(true);
			await onSend(message.trim());

			setMessage("");
			onClose();
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setMessage("");
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} placement="center">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					Send your first message to {recipientName}
				</ModalHeader>
				<ModalBody>
					<Textarea
						autoFocus
						label="Message"
						placeholder="Type your best opener..."
						value={message}
						onValueChange={setMessage}
						minRows={4}
						maxRows={8}
						maxLength={1000}
						isDisabled={isLoading}
					/>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="light" onPress={handleClose}>
						Cancel
					</Button>
					<Button
						color="success"
						onPress={handleSend}
						isLoading={isLoading}
						isDisabled={!message.trim() || isLoading}
					>
						Send
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
