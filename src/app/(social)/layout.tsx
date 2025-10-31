import { redirect } from "next/navigation";
import { FaHeartbeat } from "react-icons/fa";
import { FaGear, FaMagnifyingGlass } from "react-icons/fa6";
import { FiMessageCircle } from "react-icons/fi";
import { getAuthUser } from "../actions/auth-actions";
import { AppFooter } from "../ui/components/navbar/app-footer";
import AppNavbar from "../ui/components/navbar/app-navbar";
import AppSideNav from "../ui/components/navbar/app-sidenav";

export default async function ContentFeedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let id: string | undefined;

	try {
		id = (await getAuthUser())?.id;
	} catch (_error) {
		redirect("/login");
	}

	const topMenu = [
		{
			label: "Discover",
			href: "/discover",
			icon: <FaMagnifyingGlass size={26} />,
		},
		{ label: "Mutuals", href: "/mutuals", icon: <FaHeartbeat size={26} /> },
		{
			label: "Messages",
			href: "/messages",
			icon: <FiMessageCircle size={26} />,
		},
	];

	const bottomMenuItems = [
		{ label: "Settings", href: "/settings", icon: <FaGear size={26} /> },
	];

	return (
		<div className="flex min-h-screen flex-col">
			<AppNavbar
				currUserId={id}
				className="block md:hidden"
				topMenuItems={topMenu}
				bottomMenuItems={bottomMenuItems}
			/>
			<div className="mx-auto my-5 w-11/12 flex-1 gap-7 pb-10 md:flex lg:w-8/12">
				<AppSideNav
					currUserId={id}
					className="hidden md:block"
					topMenuItems={topMenu}
					bottomMenuItems={bottomMenuItems}
				/>
				<div className="flex w-full flex-col">{children}</div>
			</div>

			<AppFooter />
		</div>
	);
}
