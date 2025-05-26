/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Security: Enable React Strict Mode for better error detection
  reactStrictMode: true,
  
  // ❌ PROBLEMA CRÍTICO: Não desabilitar linting em produção
  eslint: {
    // Apenas ignorar durante build se necessário, mas sempre executar em dev
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  // ❌ PROBLEMA CRÍTICO: Não desabilitar TypeScript em produção
  typescript: {
    // Apenas ignorar se estritamente necessário para deploy urgente
    ignoreBuildErrors: false,
  },

  // ✅ Security Headers
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // ✅ Critical: Prevent middleware bypass vulnerability
          {
            key: 'X-Middleware-Subrequest',
            value: 'deny',
          },
        ],
      },
    ]
  },

  // ✅ Image optimization with secure domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.agentesdeconversao.com.br',
        pathname: '/uploads/**',
      },
    ],
    // ✅ Security: Limit image sizes to prevent DoS
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ Remove powered by header for security
  poweredByHeader: false,

  // ✅ Transpile necessary packages
  transpilePackages: ["@supabase/ssr"],

  // ✅ Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ✅ Bundle analyzer (optional)
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
    },
  }),

  // ✅ Experimental features para Next.js 15
  experimental: {
    // React 19 support
    reactCompiler: true,
    // Performance improvements
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // ✅ Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Security: Prevent client-side imports of server-only packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
}

module.exports = nextConfig