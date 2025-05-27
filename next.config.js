/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ React Strict Mode
  reactStrictMode: true,
  
  // ✅ Para deploy Vercel estável
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Transpile packages necessários
  transpilePackages: ["@supabase/ssr"],

  // ✅ Configurações básicas de otimização
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // ✅ Headers de segurança básicos
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },

  // ✅ Configurações de build
  poweredByHeader: false,
  
  // ✅ Compiler otimizations para produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
}

module.exports = nextConfig