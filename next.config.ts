import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    // Alternative: specify allowed domains
    // domains: ['example.com', 'yourdomain.com'],
  },
};

export default nextConfig;
