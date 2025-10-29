import type { AppNavbarProps } from "./app-navbar";
import { SideNavItem } from "./side-navitem";

export default function AppSideNav(props: AppNavbarProps) {
	return (
		<nav
			className={`${props.className} w-5/12 flex-col justify-between border-r-1 border-r-gray-600 pr-6 md:flex md:h-full`}
		>
			<ul>
				{props.topMenuItems.map((item) => (
					<SideNavItem
						key={item.href}
						label={item.label}
						href={item.href}
						icon={item.icon}
					/>
				))}
			</ul>

			<ul>
				{props.bottomMenuItems.map((item) => (
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
