// Keep the route handler minimal to meet Next.js constraints:
// import only the handler factory and consume options from a shared module.
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
