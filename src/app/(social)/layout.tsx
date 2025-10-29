import { FaHeartbeat } from "react-icons/fa";
import { FaGear, FaMagnifyingGlass } from "react-icons/fa6";
import { FiMessageCircle, FiUser } from "react-icons/fi";
import AppNavbar from "../ui/components/navbar/app-navbar";
import AppSideNav from "../ui/components/navbar/app-sidenav";

export default function ContentFeedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
		{ label: "Profile", href: "/profile", icon: <FiUser size={26} /> },
		{ label: "Settings", href: "/settings", icon: <FaGear size={26} /> },
	];

	return (
		<div>
			<AppNavbar
				className="block md:hidden"
				topMenuItems={topMenu}
				bottomMenuItems={bottomMenuItems}
			/>
			<div className="mx-auto my-5 h-[900px] w-11/12 gap-7 md:flex lg:w-8/12">
				<AppSideNav
					className="hidden md:block"
					topMenuItems={topMenu}
					bottomMenuItems={bottomMenuItems}
				/>
				<div className="w-full">{children}</div>
			</div>
		</div>
	);
}
