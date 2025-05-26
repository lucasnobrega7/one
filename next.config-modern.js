/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ React 19 + Strict Mode
  reactStrictMode: true,
  
  // ✅ NUNCA desabilitar em produção
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // 🚀 Next.js 15 Features
  experimental: {
    // React 19 Compiler para otimizações automáticas
    reactCompiler: true,
    
    // Turbopack para desenvolvimento ultra-rápido
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    
    // unstable_after API para execução pós-resposta
    after: true,
    
    // Instrumentação estável
    instrumentationHook: true,
    
    // Static Indicator para visualizar rotas estáticas
    staticIndicator: true,
  },

  // ✅ Security Headers Avançados
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
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // 🚨 Proteção contra CVE-2025-29927
          {
            key: 'X-Middleware-Subrequest-Protection',
            value: 'enabled',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.agentesdeconversao.com.br https://*.supabase.co;",
          },
        ],
      },
    ]
  },

  // ✅ Image Optimization Moderna
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
      {
        protocol: 'https',
        hostname: 'api.agentesdeconversao.com.br',
        pathname: '/uploads/**',
      },
    ],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  poweredByHeader: false,
  
  // ✅ Next.js 15: Caching otimizado
  cacheHandler: process.env.NODE_ENV === 'production' ? require.resolve('./cache-handler.js') : undefined,
  
  // ✅ Compiler otimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
}

module.exports = nextConfig