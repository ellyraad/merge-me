import Link from "next/link";
import { Logo } from "@/app/ui/base/logo";
import LoginForm from "./components/form";

export default function LoginPage() {
	return (
		<div className="flex flex-col items-center gap-10">
			<div className="flex flex-col items-center gap-6">
				<Logo width={70} height={70} />

				<h1 className="font-bold text-2xl">Sign in to MergeMe</h1>
			</div>

			<LoginForm />

			<div>
				<p>
					New to merge me?{" "}
					<Link href="/register" className="underline underline-offset-2">
						Create new account
					</Link>{" "}
				</p>
			</div>
		</div>
	);
}
