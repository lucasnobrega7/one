import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agentes de Conversão - IA que Converte',
  description: 'Plataforma de IA para criação de agentes inteligentes que convertem visitantes em clientes. 87% margem, 300+ modelos IA.',
  keywords: ['agentes de conversão', 'IA', 'chatbot', 'conversão', 'automação'],
  openGraph: {
    title: 'Agentes de Conversão - IA que Converte',
    description: 'Crie agentes inteligentes que convertem visitantes em clientes',
    url: 'https://lp.agentesdeconversao.ai',
    siteName: 'Agentes de Conversão',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentes de Conversão - IA que Converte',
    description: 'Crie agentes inteligentes que convertem visitantes em clientes',
    images: ['/og-image.png'],
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {children}
    </div>
  )
}