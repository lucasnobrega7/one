import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato - Agentes de Conversão',
  description: 'Entre em contato conosco para saber mais sobre nossos agentes conversacionais.',
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Contato</h1>
        <p className="text-gray-300">
          Página em construção. Aqui será o formulário de contato.
        </p>
      </div>
    </div>
  )
}