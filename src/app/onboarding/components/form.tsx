"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Input, Textarea } from "@heroui/input";
import { Button, Grid } from "@primer/react-brand";
import { type Key, useState } from "react";
import type {
	Image,
	JobTitle,
	ProgrammingLanguage,
} from "@/generated/prisma/client";
import { FieldGroupWrapper } from "./field-group-wrapper";
import { FormCardWrapper } from "./form-card-wrapper";
import { ImageUploadButton } from "./image-upload-btn";
import { UploadedImagePreview } from "./uploaded-image-preview";

type FormDetails = {
	languages: ProgrammingLanguage[];
	jobTitles: JobTitle[];
	photo?: Image | null;
};

export function OnboardingProfileForm({ details }: { details: FormDetails }) {
	const [choices, setChoices] = useState<(Key | null)[]>([null, null, null]);
	const [isUploading, setIsUploading] = useState(false);

	const getAvailableLanguages = (idx: Key | null) => {
		const selectedIds = choices.filter(
			(choice, i) => i !== idx && choice !== null,
		);
		return details.languages.filter(lang => !selectedIds.includes(lang.id));
	};

	const updateChoice = (index: number) => (key: Key | null) => {
		setChoices(prev => {
			const updated = [...prev];
			updated[index] = key;
			return updated;
		});
	};

	return (
		<form className="my-10">
			<Grid fullWidth className="wrap">
				<Grid.Column
					as="div"
					span={{ xsmall: 12, medium: 6 }}
					className="rounded-lg"
				>
					<FormCardWrapper title="Basic Information">
						<Textarea
							isRequired
							variant="bordered"
							label="Bio"
							placeholder="Time to impress your fellow nerds..."
						/>

						<FieldGroupWrapper title="Where are you from?">
							{/* FIXME: temporary, use autocomplete */}
							<Input isRequired variant="bordered" label="City" />
							<Input isRequired variant="bordered" label="Country" />
						</FieldGroupWrapper>

						<FieldGroupWrapper title="Current status/job title">
							<Autocomplete
								items={details.jobTitles}
								variant="bordered"
								label="Job title"
							>
								{item => (
									<AutocompleteItem key={item.id} textValue={item.name}>
										{item.name}
									</AutocompleteItem>
								)}
							</Autocomplete>
						</FieldGroupWrapper>

						<FieldGroupWrapper
							title="Your top programming languages"
							layout="column"
						>
							{[0, 1, 2].map(idx => (
								<Autocomplete
									isRequired
									variant="bordered"
									key={idx}
									label={`Top ${idx + 1}`}
									selectedKey={choices[idx] as string | null}
									items={getAvailableLanguages(idx)}
									onSelectionChange={updateChoice(idx)}
								>
									{item => (
										<AutocompleteItem key={item.id} textValue={item.name}>
											{item.name}
										</AutocompleteItem>
									)}
								</Autocomplete>
							))}
						</FieldGroupWrapper>
					</FormCardWrapper>
				</Grid.Column>

				<Grid.Column
					as="div"
					className="rounded-lg"
					span={{ xsmall: 12, medium: 6 }}
				>
					<FormCardWrapper title="Show your best look">
						<ImageUploadButton
							isUploading={isUploading}
							onUploadingChange={setIsUploading}
						/>
						<div className="mx-auto my-5 w-fit">
							<UploadedImagePreview
								userImage={details.photo}
								isUploading={isUploading}
							/>
						</div>
					</FormCardWrapper>
				</Grid.Column>

				<Grid.Column span={12} className="flex justify-end">
					<Button variant="primary" size="large">
						Save
					</Button>
				</Grid.Column>
			</Grid>
		</form>
	);
}
