import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure webpack externals for wagmi/viem dependencies
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Empty turbopack config to acknowledge we're using webpack intentionally
  turbopack: {},
};

export default nextConfig;
