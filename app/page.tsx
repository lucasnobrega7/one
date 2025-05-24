import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, MessageSquare, Zap, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Hero Section */}
        <section className="container flex min-h-[600px] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-16 text-center">
          <div className="space-y-4">
            <h1 className="bg-gradient-to-br from-white from-30% via-white/90 to-white/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              Transforme suas conversas
              <br />
              em conversões
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-gray-300 sm:text-xl sm:leading-8">
              Agentes de IA personalizados para automatizar atendimento, vendas e suporte ao cliente.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild className="bg-white text-black hover:bg-gray-200">
              <Link href="/dashboard">
                Acessar Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <Link href="/docs">
                Documentação
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container max-w-screen-2xl py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recursos Principais</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Ferramentas poderosas para criar, gerenciar e otimizar seus agentes de IA
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Agentes Inteligentes</h3>
              <p className="text-gray-400 text-sm">
                IA avançada para conversas naturais e eficazes
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">Multi-canal</h3>
              <p className="text-gray-400 text-sm">
                WhatsApp, Telegram, Site e outras plataformas
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Automação</h3>
              <p className="text-gray-400 text-sm">
                Fluxos automatizados para vendas e suporte
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold">Analytics</h3>
              <p className="text-gray-400 text-sm">
                Relatórios detalhados de performance e conversões
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container max-w-screen-2xl py-16">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Crie sua conta e configure seus primeiros agentes em minutos
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-white text-black hover:bg-gray-200">
                <Link href="/onboarding">
                  Começar Agora
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
