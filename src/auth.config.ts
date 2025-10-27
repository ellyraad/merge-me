import type { NextAuthConfig } from "next-auth";
import { authRoutes, publicRoutes } from "./lib/routes";

export default {
	callbacks: {
		async authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			if (publicRoutes.includes(nextUrl.pathname)) {
				return true;
			}

			if (authRoutes.includes(nextUrl.pathname)) {
				if (isLoggedIn) {
					return Response.redirect(new URL("/feed", nextUrl));
				}

				return true;
			}

			return isLoggedIn || Response.redirect(new URL("/login", nextUrl));
		},

		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
	providers: [],
} satisfies NextAuthConfig;
