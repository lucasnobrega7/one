/** @type {import('next').NextConfig} */
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
  poweredByHeader: false,
  transpilePackages: ["@supabase/ssr"],
  experimental: {
    esmExternals: false,
  },

}

module.exports = nextConfig