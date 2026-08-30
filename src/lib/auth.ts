import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiServices } from "@/services/api";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await apiServices.signIn({
          email: credentials.email,
          password: credentials.password,
        });

        // The Route ecommerce API returns { message: "success", user, token }
        // on success and a different message (e.g. "fail") on bad credentials.
        if (response.message !== "success" || !response.token) {
          return null;
        }

        return {
          id: response.user.email,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          token: response.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // `user` is only defined right after sign-in.
      if (user) {
        token.token = (user as { token?: string }).token;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.token = token.token as string | undefined;
      session.user.role = token.role as string | undefined;
      return session;
    },
  },
};
