/** @type {import('next').NextConfig} */
const INTERNAL_DASHBOARD_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:3001" 
  : "https://dashboard-agentes-conversao-em-atividade.up.railway.app";

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "avatars.githubusercontent.com", 
      "lh3.googleusercontent.com",
    ],
  },
  transpilePackages: ["@repo/ui", "@repo/utils", "@repo/auth"],
  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: `${INTERNAL_DASHBOARD_URL}/dashboard`,
      },
      {
        source: "/dashboard/:match*",
        destination: `${INTERNAL_DASHBOARD_URL}/dashboard/:match*`,
      },
    ];
  },
}

module.exports = nextConfig