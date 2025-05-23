/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // ❌ REMOVIDO: eslint.ignoreDuringBuilds e typescript.ignoreBuildErrors
  // Essas configurações mascaravam problemas reais
  
  images: {
    unoptimized: false, // Melhor performance
    domains: [
      "images.unsplash.com",
      "avatars.githubusercontent.com", 
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "api.agentesdeconversao.com.br"
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Configuração para APIs externas
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://api.agentesdeconversao.com.br"}/:path*`,
      },
    ]
  },

  // Headers de segurança (removendo duplicatas do vercel.json)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options", 
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  // Otimizações de produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Configuração para external packages (Supabase)
  serverExternalPackages: ['@supabase/supabase-js'],

  // ❌ REMOVIDO: transpilePackages com @clerk/nextjs (não está sendo usado)
  
  // Otimizar imports para reduzir bundle
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },

  poweredByHeader: false,
}

export default nextConfig
