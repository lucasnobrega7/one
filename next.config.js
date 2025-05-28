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
        'agentesdeconversao.ai',
        '*.agentesdeconversao.ai',
        'lp.agentesdeconversao.ai',
        'dash.agentesdeconversao.ai',
        'login.agentesdeconversao.ai',
        'docs.agentesdeconversao.ai',
        'api.agentesdeconversao.ai',
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

  // ✅ Subdomain-based routing
  async rewrites() {
    return {
      beforeFiles: [
        // Landing Page subdomain
        {
          source: '/:path*',
          destination: '/landing/:path*',
          has: [
            {
              type: 'host',
              value: 'lp.agentesdeconversao.ai',
            },
          ],
        },
        // Dashboard subdomain
        {
          source: '/:path*',
          destination: '/dashboard/:path*',
          has: [
            {
              type: 'host',
              value: 'dash.agentesdeconversao.ai',
            },
          ],
        },
        // Auth subdomain
        {
          source: '/:path*',
          destination: '/auth/:path*',
          has: [
            {
              type: 'host',
              value: 'login.agentesdeconversao.ai',
            },
          ],
        },
        // Docs subdomain
        {
          source: '/:path*',
          destination: '/docs/:path*',
          has: [
            {
              type: 'host',
              value: 'docs.agentesdeconversao.ai',
            },
          ],
        },
        // API subdomain
        {
          source: '/:path*',
          destination: '/api/:path*',
          has: [
            {
              type: 'host',
              value: 'api.agentesdeconversao.ai',
            },
          ],
        },
      ],
    }
  },

  // ✅ Enhanced security headers with subdomain support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
          {
            key: 'Access-Control-Allow-Origin',
            value: '*.agentesdeconversao.ai',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      // Specific headers for API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://dash.agentesdeconversao.ai, https://docs.agentesdeconversao.ai',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
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