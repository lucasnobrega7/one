import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Agentes de Conversão',
  description: 'Artigos e insights sobre IA conversacional, chatbots e automação de vendas.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Blog</h1>
        <p className="text-gray-300">
          Página em construção. Aqui será o blog com conteúdo sobre IA conversacional.
        </p>
      </div>
    </div>
  )
}