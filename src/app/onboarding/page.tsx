import { getAuthUser } from "../actions/auth-actions";
import { getJobTitles } from "../actions/jobtitle-actions";
import { getProgrammingLanguages } from "../actions/proglang-actions";
import { OnboardingProfileForm } from "./components/form";

export default async function OnboardingPage() {
	const languages = await getProgrammingLanguages();
	const jobTitles = await getJobTitles();

	const currentUser = await getAuthUser();

	return (
		<div className="my-10">
			<div className="mx-5">
				<p className="text-2xl">
					Hello <span className="font-bold">{currentUser?.firstName}</span>!
				</p>
				<h1 className="mt-2 font-bold text-4xl">
					Let's setup your dev profile
				</h1>
			</div>

			<OnboardingProfileForm
				details={{ languages, jobTitles, photo: currentUser?.photo }}
			/>
		</div>
	);
}
