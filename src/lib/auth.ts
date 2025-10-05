import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import apiClient from "./apiClient";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
    accessToken?: string;
  }

  interface User {
    id: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    accessToken?: string;
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com"
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****"
        },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const res = await apiClient("api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });

        if (!res.ok) return null;

        const data = await res.data;
        if (!data?.user?.id) return null;

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          accessToken: data.token,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        (session.user as any).id = token.sub as string | undefined;
      }
      session.accessToken = token.accessToken as string | undefined;
      return session;
    }
  }
});
