import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";
import { loginDataSchema } from "./lib/schemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig,
	providers: [
		Credentials({
			name: "credentials",
			async authorize(creds) {
				const validated = loginDataSchema.safeParse(creds);
				if (!validated.success) {
					return null; // FIXME: proper error handling
				}

				const { email, password } = validated.data;
				const user = await prisma.user.findUnique({ where: { email } });

				if (!(user && (await compare(password, user.passwordHash)))) {
					return null; // FIXME: proper error handling
				}

				// biome-ignore lint/correctness/noUnusedVariables: supposed to be separated
				const { passwordHash, ...rest } = user;
				return rest;
			},
		}),
	],
});
