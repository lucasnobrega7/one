import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Agentes de Conversão - Transforme Visitantes em Clientes',
  description: 'Plataforma completa de agentes conversacionais com IA para aumentar suas vendas e melhorar o atendimento ao cliente.',
  keywords: 'chatbot, IA, conversão, vendas, atendimento, WhatsApp, automação',
  openGraph: {
    title: 'Agentes de Conversão - Transforme Visitantes em Clientes',
    description: 'Plataforma completa de agentes conversacionais com IA para aumentar suas vendas e melhorar o atendimento ao cliente.',
    url: 'https://lp.agentesdeconversao.ai',
    siteName: 'Agentes de Conversão',
    images: [
      {
        url: 'https://lp.agentesdeconversao.ai/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentes de Conversão - Transforme Visitantes em Clientes',
    description: 'Plataforma completa de agentes conversacionais com IA para aumentar suas vendas.',
    images: ['https://lp.agentesdeconversao.ai/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="canonical" href="https://lp.agentesdeconversao.ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0e0e10" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
          {children}
        </div>
      </body>
    </html>
  )
}