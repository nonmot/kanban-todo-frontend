import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
        const res = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials.email, password: credentials.password, })
        });
        if (!res.ok) return null;
        const data = await res.json();
        return { ...data.user, appJwt: data.token };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if ((user as any)?.appJwt) {
        token.appJwt = (user as any).appJwt;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).appJwt = token.appJwt;
      return session;
    }
  }
});
