import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onboarding - Agentes de Conversão',
  description: 'Configure sua conta e crie seu primeiro agente conversacional.',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Bem-vindo!</h1>
        <p className="text-gray-300">
          Página em construção. Aqui será o fluxo de onboarding completo.
        </p>
      </div>
    </div>
  )
}