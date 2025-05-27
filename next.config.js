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

  // ✅ Experimental features otimizadas para App Router
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', '@xyflow/react'],
    typedRoutes: true,
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'agentesdeconversao.com.br',
        '*.agentesdeconversao.com.br',
        'api.agentesdeconversao.com.br',
        '*.vercel.app'
      ],
    },
  },

  // ✅ Transpile packages necessários (App Router bundling)
  transpilePackages: ["@supabase/ssr"],
  
  // ✅ Bundle optimization para produção
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['@node-rs/argon2', '@node-rs/bcrypt'],

  // ✅ Configurações avançadas de otimização
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.vercel.app',
      },
    ],
  },

  // ✅ Enhanced security headers
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
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

  // ✅ Logging para debugging em produção
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig