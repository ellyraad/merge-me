import { getJobTitles } from "../actions/jobtitle-actions";
import { getProgrammingLanguages } from "../actions/proglang-actions";
import { OnboardingProfileForm } from "./components/form";

export default async function OnboardingPage() {
	const languages = await getProgrammingLanguages();
	const jobTitles = await getJobTitles();

	return (
		<div className="my-10">
			<div className="mx-5">
				<h1 className="font-bold text-4xl">Let's setup your dev profile</h1>
			</div>

			<OnboardingProfileForm details={{ languages, jobTitles }} />
		</div>
	);
}
