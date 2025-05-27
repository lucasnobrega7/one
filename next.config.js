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
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        'agentesdeconversao.ai', 
        '*.agentesdeconversao.ai',
        'lp.agentesdeconversao.ai',
        'dash.agentesdeconversao.ai',
        'login.agentesdeconversao.ai',
        'docs.agentesdeconversao.ai',
        'api.agentesdeconversao.ai'
      ],
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    }
    return config
  },
}

module.exports = nextConfig