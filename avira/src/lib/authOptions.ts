// Centralized NextAuth options used by route handlers
// Keeping this outside of app routes avoids Next.js static export errors
// and makes the project Vercel-friendly.

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// Optional adapter (uncomment if using Mongo adapter)
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/lib/mongoClient";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Implement real auth or return null
        return null;
      },
    }),
  ],
  // adapter: MongoDBAdapter(clientPromise), // enable if you use a DB adapter
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session /*, token */ }) {
      // attach custom token data if needed
      return session;
    },
  },
  // Route NextAuth to your custom pages instead of the default UI
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};


