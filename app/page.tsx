import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Bot, Brain, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-normal mb-6 leading-tight">
            Agentes de{" "}
            <span className="gradient-text-langflow">
              Conversão
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transforme suas conversas em conversões com agentes de IA personalizados
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="btn-primary-langflow px-8 py-4 text-lg">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="btn-outline-langflow px-8 py-4 text-lg">
                Ver Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-normal text-center mb-16">
            Recursos Poderosos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hero-card-langflow">
              <Bot className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Agentes Personalizados</h3>
              <p className="text-gray-400">
                Crie agentes únicos para seu negócio com prompts customizados
              </p>
            </Card>
            
            <Card className="hero-card-langflow">
              <Brain className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Base de Conhecimento</h3>
              <p className="text-gray-400">
                Alimente seus agentes com documentos e conhecimento específico
              </p>
            </Card>
            
            <Card className="hero-card-langflow">
              <Zap className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Integração Simples</h3>
              <p className="text-gray-400">
                WhatsApp Z-API, webhooks e APIs RESTful para qualquer plataforma
              </p>
            </Card>
            
            <Card className="hero-card-langflow">
              <Shield className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Seguro & Confiável</h3>
              <p className="text-gray-400">
                Dados protegidos com criptografia e controle de acesso
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Crie seu primeiro agente em menos de 5 minutos
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="btn-primary-langflow px-8 py-4 text-lg">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
