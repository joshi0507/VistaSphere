import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '550mb',
    },
  },

  allowedDevOrigins: ['10.70.132.69'],

  turbopack: {},
};

export default nextConfig;
