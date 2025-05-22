import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/layout/navigation"
import { HeroGeometric } from "@/components/hero-geometric"
import { PricingPlans } from "@/components/onboarding/pricing-plans"

export const metadata: Metadata = {
  title: "Agentes de Conversão | Crie agentes de IA conversacionais",
  description:
    "Plataforma para criar e gerenciar agentes de IA conversacionais personalizados com base de conhecimento.",
}

export default function HomePage() {
  const handlePlanSelect = (planId: string) => {
    // Redirecionar para signup com plano selecionado
    window.location.href = `/signup?plan=${planId}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <HeroGeometric
        badge="Agentes de Conversão"
        title1="Criando agentes de IA seguros"
        title2="que beneficiam a humanidade"
      />

      {/* Features Section */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-2xl font-normal mb-3">Crie agentes personalizados</h3>
            <p className="text-white/70 mb-4">
              Configure agentes de IA conversacionais adaptados às suas necessidades específicas com integração WhatsApp.
            </p>
            <Link href="/features" className="text-sm flex items-center hover:underline">
              Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-2xl font-normal mb-3">Base de conhecimento</h3>
            <p className="text-white/70 mb-4">
              Alimente seus agentes com documentos e dados específicos do seu negócio para respostas mais precisas.
            </p>
            <Link href="/features#knowledge-base" className="text-sm flex items-center hover:underline">
              Como funciona <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-2xl font-normal mb-3">Integração WhatsApp</h3>
            <p className="text-white/70 mb-4">
              Conecte seus agentes ao WhatsApp Business via Z-API e automatize seu atendimento.
            </p>
            <Link href="/docs/whatsapp" className="text-sm flex items-center hover:underline">
              Ver guia de integração <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Escolha o Plano Ideal para Você
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comece grátis e escale conforme sua necessidade. Todos os planos incluem 14 dias de teste.
            </p>
          </div>
          
          <PricingPlans onSelectPlan={handlePlanSelect} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-normal mb-6">Comece a criar seu agente hoje</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl">
            Configure seu primeiro agente em minutos e transforme a maneira como você interage com seus clientes via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link href="/signup">Criar conta gratuita</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
              <Link href="/docs">Ver documentação</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}