import Link from "next/link";
import { Logo } from "@/app/ui/base/logo";
import RegisterForm from "./components/form";

export default function RegisterPage() {
	return (
		<div className="flex flex-col items-center gap-10">
			<div className="flex flex-col items-center gap-6">
				<Logo width={70} height={70} />

				<h1 className="font-bold text-2xl">Create Your Account</h1>
			</div>

			<RegisterForm />

			<div>
				<p>
					Already have an account?{" "}
					<Link href="/login" className="underline underline-offset-2">
						Login
					</Link>{" "}
				</p>
			</div>
		</div>
	);
}
