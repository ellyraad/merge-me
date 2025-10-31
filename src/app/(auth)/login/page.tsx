import { AuthFooterLink } from "../components/auth-footer-link";
import { AuthHeader } from "../components/auth-header";
import LoginForm from "./components/form";

export default function LoginPage() {
	return (
		<div className="flex flex-col items-center gap-10">
			<AuthHeader title="Sign in to MergeMe" />

			<LoginForm />

			<AuthFooterLink
				text="New to merge me?"
				linkText="Create new account"
				linkHref="/register"
			/>
		</div>
	);
}
