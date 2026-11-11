import type { NextConfig } from "next";

const storage = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://trnubhalqrkxfrkhvkld.supabase.co");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "16mb" },
  },
  images: {
    // Next.js 16 requires quality values to be allow-listed (defaults to [75])
    qualities: [75, 90],
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development" && storage.hostname === "127.0.0.1",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trnubhalqrkxfrkhvkld.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      new URL("/storage/v1/object/public/**", storage),
    ],
  },
};

export default nextConfig;
