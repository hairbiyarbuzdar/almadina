import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "16mb" },
  },
  images: {
    // Next.js 16 requires quality values to be allow-listed (defaults to [75])
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trnubhalqrkxfrkhvkld.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
