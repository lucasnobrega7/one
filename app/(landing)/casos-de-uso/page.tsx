import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Casos de Uso - Agentes de Conversão',
  description: 'Descubra como empresas estão transformando seus resultados com nossos agentes conversacionais.',
}

export default function CasosDeUsoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Casos de Uso</h1>
        <p className="text-gray-300">
          Página em construção. Aqui serão apresentados os casos de sucesso dos nossos clientes.
        </p>
      </div>
    </div>
  )
}