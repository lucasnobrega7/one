/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 🚀 Next.js 15 Experimental Features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
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
    typedRoutes: true, // Rotas tipadas
    optimizePackageImports: ['@/components/ui', '@/lib'],
    // ppr: 'incremental', // Partial Pre-rendering (requer canary)
  },
  
  // 🖼️ Otimizações de imagem
  images: {
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com', 
      'lh3.googleusercontent.com',
      'agentesdeconversao.ai',
      'dash.agentesdeconversao.ai'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 🔒 Headers de segurança aprimorados
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://agentesdeconversao.ai' 
              : 'http://localhost:3000'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          },
        ]
      }
    ];
  },
  
  // 🔄 Redirects para legacy .com.br
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'agentesdeconversao.com.br',
          },
        ],
        destination: 'https://lp.agentesdeconversao.ai/:path*',
        permanent: true,
      },
      // Redirects internos para subdomínios
      {
        source: '/dashboard/:path*',
        destination: 'https://dash.agentesdeconversao.ai/:path*',
        permanent: false,
      },
      {
        source: '/login',
        destination: 'https://login.agentesdeconversao.ai',
        permanent: false,
      },
      {
        source: '/docs/:path*',
        destination: 'https://docs.agentesdeconversao.ai/:path*',
        permanent: false,
      }
    ];
  },
  
  // 🛠️ Configuração do compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 📦 Transpile packages
  transpilePackages: ['@supabase/ssr'],
  
  // 🚀 Output standalone para deploy otimizado
  output: 'standalone',
  
  // ⚡ Build performance
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // 🔧 Configurações adicionais
  poweredByHeader: false,
  compress: true,
  
  // 🌐 Internationalization (futuro)
  // i18n: {
  //   locales: ['pt-BR', 'en'],
  //   defaultLocale: 'pt-BR',
  // },
  
  // 📊 Bundle Analyzer (desenvolvimento)
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      ...nextConfig.experimental,
    }
  }),
};

module.exports = nextConfig;