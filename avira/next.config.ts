import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow common domains used by OAuth providers; adjust as needed
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.gravatar.com" as unknown as string },
    ],
  },
};

export default nextConfig;
