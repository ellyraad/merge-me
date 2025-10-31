import { FiUser } from "react-icons/fi";
import { Logo } from "../../base/logo";
import type { AppNavbarProps } from "./app-navbar";
import { SideNavItem } from "./side-navitem";

export default function AppSideNav(props: AppNavbarProps) {
	return (
		<nav
			className={`${props.className} w-5/12 flex-col justify-between border-r-1 border-r-gray-600 pr-6 md:flex md:h-full`}
		>
			<div>
				<div className="mb-10 px-5 pt-1">
					<Logo
						className="rounded-full border-1 border-gray-400 dark:border-0"
						width={50}
						height={50}
					/>
				</div>
				<ul>
					{props.topMenuItems.map(item => (
						<SideNavItem
							key={item.href}
							label={item.label}
							href={item.href}
							icon={item.icon}
						/>
					))}
				</ul>
			</div>

			<ul>
				<SideNavItem
					label="Profile"
					href={`/user/${props.currUserId}`}
					icon={<FiUser size={26} />}
				/>
				{props.bottomMenuItems.map(item => (
					<SideNavItem
						key={item.href}
						label={item.label}
						href={item.href}
						icon={item.icon}
					/>
				))}
			</ul>
		</nav>
	);
}
