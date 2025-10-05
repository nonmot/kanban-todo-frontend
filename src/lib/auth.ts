import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import apiClient from "./apiClient";

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
        try {
          const res = await apiClient("api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
          });

          if (!res.ok) return null;

          const data = await res.data;
          return { ...data.user, appJwt: data.token };
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if ((user as any)?.appJwt) {
        token.appJwt = (user as any).appJwt;
      }
      console.log(token);
      return token;
    },
    async session({ session, token }) {
      (session as any).appJwt = token.appJwt;
      (session as any).id = token.sub;
      console.log(session)
      return session;
    }
  }
});
