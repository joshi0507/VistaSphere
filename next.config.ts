import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '550mb',
    },
  },

  // Allow HMR and other dev resources from network IP
  allowedDevOrigins: ['10.70.132.69'],

  // Empty turbopack config to silence Turbopack warning
  turbopack: {},

  // Allow serving from any origin for dev
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/qr/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
