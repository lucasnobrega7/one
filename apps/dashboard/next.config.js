/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/dashboard",
  assetPrefix: "/dashboard",
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
  poweredByHeader: false,
  transpilePackages: ["@supabase/ssr", "@repo/ui", "@repo/utils", "@repo/database", "@repo/auth", "@repo/ai"],
  experimental: {
    esmExternals: false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig