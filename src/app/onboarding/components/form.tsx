"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button as HUButton } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@primer/react-brand";
import type { Image, JobTitle, ProgrammingLanguage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type Key, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { submitOnboarding } from "@/app/actions/onboarding-actions";
import { type OnboardingSchema, onboardingSchema } from "@/lib/schemas";
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
	const [languageChoices, setLanguageChoices] = useState<(Key | null)[]>([
		null,
		null,
		null,
	]);
	const [isUploading, setIsUploading] = useState(false);

	// form handling
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(onboardingSchema),
		mode: "onTouched",
		defaultValues: {
			bio: "",
			city: "",
			country: "",
			jobTitle: "",
			programmingLanguages: [],
			photo: details.photo
				? {
						publicId: details.photo.publicId ?? "",
						url: details.photo.url ?? "",
					}
				: { publicId: "", url: "" }, // Initialize with empty object
		},
	});

	const watchedPhoto = watch("photo") || { publicId: "", url: "" };

	const router = useRouter();
	const onSubmit: SubmitHandler<OnboardingSchema> = async (
		data: OnboardingSchema,
	) => {
		if (!watchedPhoto) {
			await trigger("photo");
			return;
		}

		const result = await submitOnboarding(data);
		if (result.status === "error") {
			addToast({
				title: "Error completing profile",
				description: result.error as string,
				color: "danger",
			});
			return;
		}

		addToast({
			title: "Profile completed successfully!",
			description: "Redirecting you to the feed...",
			color: "success",
		});

		router.push("/discover");
	};

	const getAvailableLanguages = (idx: Key | null) => {
		const selectedIds = languageChoices.filter(
			(choice, i) => i !== idx && choice !== null,
		);
		return details.languages.filter(lang => !selectedIds.includes(lang.id));
	};

	const updateLanguageChoice = (index: number) => (key: Key | null) => {
		const updated = [...languageChoices];
		updated[index] = key;
		setLanguageChoices(updated);

		const validChoices = updated
			.filter(choice => choice !== null)
			.map(choice => {
				const lang = details.languages.find(l => l.id === choice);
				return lang?.name ?? "";
			})
			.filter(name => name !== "");
		setValue("programmingLanguages", validChoices);
	};

	return (
		<form className="my-10" onSubmit={handleSubmit(onSubmit)}>
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
							isInvalid={!!errors.bio}
							errorMessage={errors.bio?.message}
							{...register("bio")}
							placeholder="Time to impress your fellow nerds..."
						/>

						<FieldGroupWrapper title="Where are you from?">
							{/* FIXME: temporary, use autocomplete */}
							<Input
								isRequired
								variant="bordered"
								label="City"
								isInvalid={!!errors.city}
								errorMessage={errors.city?.message}
								{...register("city")}
							/>
							<Input
								isRequired
								variant="bordered"
								label="Country"
								isInvalid={!!errors.country}
								errorMessage={errors.country?.message}
								{...register("country")}
							/>
						</FieldGroupWrapper>

						<FieldGroupWrapper title="Current status/job title">
							<Autocomplete
								items={details.jobTitles}
								variant="bordered"
								label="Job title"
								onSelectionChange={key => {
									const selectedJobTitle = details.jobTitles.find(
										jt => jt.id === key,
									);
									setValue("jobTitle", selectedJobTitle?.name ?? "");
								}}
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
									items={getAvailableLanguages(idx)}
									onSelectionChange={updateLanguageChoice(idx)}
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
						{!watchedPhoto && errors.photo && (
							<p className="mb-2 text-red-500 text-sm">Photo is required</p>
						)}
						<ImageUploadButton
							setValue={(value: OnboardingSchema["photo"]) =>
								setValue("photo", value)
							}
							isUploading={isUploading}
							onUploadingChange={setIsUploading}
						/>
						<div className="mx-auto my-5 w-fit">
							<UploadedImagePreview
								setValue={(value: OnboardingSchema["photo"]) =>
									setValue("photo", value)
								}
								userImage={details.photo}
								isUploading={isUploading}
							/>
						</div>
					</FormCardWrapper>
				</Grid.Column>

				<Grid.Column span={12} className="flex justify-end">
					<HUButton
						color="success"
						size="lg"
						type="submit"
						disabled={isSubmitting}
						isLoading={isSubmitting}
					>
						Save
					</HUButton>
				</Grid.Column>
			</Grid>
		</form>
	);
}
