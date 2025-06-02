import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import connectToDatabase from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        identifier: { label: "StudentID/ParentID/Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const { identifier, password, role } = credentials!;
        const client = await connectToDatabase();
        const db = client.db("dropoutDB");

        if (role === "student") {
          const student = await db.collection("students").findOne({ student_id: identifier, password });
          if (student) {
            return { id: student.student_id, name: student.name, role: "student" };
          }
        }

        if (role === "parent") {
          const parent = await db.collection("parents").findOne({ parent_id: identifier, password });
          if (parent) {
            return { id: parent.parent_id, name: parent.name, role: "parent" };
          }
        }

        if (role === "admin" && identifier === "admin" && password === "admin") {
          return { id: "admin", name: "Admin", role: "admin" };
        }

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
