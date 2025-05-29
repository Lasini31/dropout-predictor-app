import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

async function mockLogin(id: string, password: string, role: string) {
  const users = {
    student: { id: "stu123", name: "Student", role: "student", password: "123" },
    parent: { id: "par123", name: "Parent", role: "parent", password: "123" },
    admin: { id: "admin", name: "Admin", role: "admin", password: "admin" },
  };

  const user = users[role as keyof typeof users];
  if (user && user.id === id && user.password === password) {
    return { id: user.id, name: user.name, role: user.role };
  }
  return null;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        identifier: { label: "Index/ParentID/Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const { identifier, password, role } = credentials!;
        const user = await mockLogin(identifier, password, role);
        if (user) return user;
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
