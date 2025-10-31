import { AuthFooterLink } from "../components/auth-footer-link";
import { AuthHeader } from "../components/auth-header";
import RegisterForm from "./components/form";

export default function RegisterPage() {
	return (
		<div className="flex flex-col items-center gap-10">
			<AuthHeader title="Create Your Account" />

			<RegisterForm />

			<AuthFooterLink
				text="Already have an account?"
				linkText="Login"
				linkHref="/login"
			/>
		</div>
	);
}
