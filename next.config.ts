import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 requires quality values to be allow-listed (defaults to [75])
    qualities: [75, 90],
  },
};

export default nextConfig;
