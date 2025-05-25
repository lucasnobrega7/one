/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: [
      "images.unsplash.com",
      "avatars.githubusercontent.com", 
      "lh3.googleusercontent.com",
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
  },
  
  // Security headers
  poweredByHeader: false,
  
  // Performance optimizations
  swcMinify: true,
  compress: true,
  
  // Skip type checking during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Bundle optimization
  transpilePackages: ["@supabase/ssr"],
  experimental: {
    scrollRestoration: true,
  },
  
  // Headers for production
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
        ],
      },
    ]
  },
  
  // Static file caching
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/:path*',
      },
    ]
  },
}

module.exports = nextConfig