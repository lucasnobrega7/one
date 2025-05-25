import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Bot, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">Agentes de Conversão</span>
          </div>
          <div className="space-x-4">
            <Button asChild variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/auth/signup">Cadastrar</Link>
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transforme Conversas em{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Conversões
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Crie agentes de IA inteligentes que automatizam suas conversas, 
            melhoram o atendimento e aumentam suas vendas 24/7.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/dashboard">
                <Bot className="mr-2 h-5 w-5" />
                Começar Agora
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              <Link href="/docs">
                Ver Documentação
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Chat Inteligente</CardTitle>
              <CardDescription className="text-gray-400">
                Agentes que entendem contexto e respondem de forma natural
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Automação Completa</CardTitle>
              <CardDescription className="text-gray-400">
                Integração com WhatsApp, Telegram e múltiplas plataformas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Seguro e Confiável</CardTitle>
              <CardDescription className="text-gray-400">
                Dados protegidos com criptografia e backup em nuvem
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-green-900/20 border border-green-700 rounded-full px-6 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Sistema Online</span>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            API v2 funcionando • Backend ativo no Railway • Frontend no Vercel
          </p>
        </div>
      </div>
    </div>
  )
}
