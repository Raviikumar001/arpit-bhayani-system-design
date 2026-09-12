import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Static export for Cloudflare Workers Static Assets: every route is
  // pre-rendered to HTML at build time (all content is static JSON).
  output: "export",

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**', // Allows all paths on the domain
      },
    ],
  }
};

export default nextConfig;
