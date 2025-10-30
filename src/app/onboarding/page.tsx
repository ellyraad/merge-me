import { getAuthUser } from "../actions/auth-actions";
import { OnboardingProfileForm } from "./components/form";

export default async function OnboardingPage() {
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

			<OnboardingProfileForm photo={currentUser?.photo} />
		</div>
	);
}
