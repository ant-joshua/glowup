import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.pixverse.ai",
      },
    ],
  },
};

export default nextConfig;
