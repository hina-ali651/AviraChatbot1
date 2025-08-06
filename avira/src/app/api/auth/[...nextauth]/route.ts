import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials?.email });
        if (user && user.password && credentials?.password) {
          // Simple password check (for demo only, use hashing in production!)
          if (user.password === credentials.password) {
            return { id: user._id.toString(), email: user.email, name: user.name };
          }
        }
        // If user does not exist, create new user (signup)
        if (!user && credentials?.email && credentials?.password) {
          const newUser = await db.collection("users").insertOne({
            email: credentials.email,
            password: credentials.password, // For demo only! Hash in production.
            name: credentials.email.split("@")[0],
          });
          return { id: newUser.insertedId.toString(), email: credentials.email, name: credentials.email.split("@")[0] };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.image = token.picture || token.image || session.user.image;
      }
      return session;
    },
    async jwt({ token, user, account, profile }: { token: any, user?: any, account?: any, profile?: any }) {
      // For Google provider, persist image
      if (account?.provider === "google" && profile) {
        token.picture = profile.picture;
        token.image = profile.picture;
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image || token.picture;
      }
      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
