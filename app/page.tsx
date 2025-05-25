"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Brain, MessageSquare, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header estilo OpenAI */}
      <header className="openai-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Agentes de Conversão</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/research" className="text-gray-300 hover:text-white transition-colors">Pesquisa</Link>
              <Link href="/api" className="text-gray-300 hover:text-white transition-colors">API</Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Agentes</Link>
              <Link href="/safety" className="text-gray-300 hover:text-white transition-colors">Segurança</Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">Empresa</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                Entrar
              </Link>
              <Link 
                href="/auth/signup"
                className="btn-openai-primary text-sm"
                aria-label="Criar conta gratuita para usar Agentes de Conversão"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section estilo OpenAI */}
      <main>
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
          
          <div className="relative pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 openai-card-elevated px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Integrado com WhatsApp, Website e APIs
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Crie Agentes de IA em minutos
              </h1>

              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Transforme visitantes em clientes com agentes conversacionais inteligentes.<br />
                Sem código, sem complicação. Apenas resultados.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                <Link 
                  href="/auth/signup"
                  className="btn-openai-primary px-8 py-4 text-lg flex items-center justify-center"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/api"
                  className="btn-openai-secondary px-8 py-4 text-lg"
                >
                  Ver Documentação
                </Link>
              </div>

              {/* Stats grid estilo OpenAI */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center" role="group" aria-label="Estatísticas de performance dos agentes">
                <div className="openai-card p-6" role="article">
                  <div className="openai-heading text-3xl mb-2" aria-label="45% de aumento na conversão">45%+</div>
                  <div className="openai-caption">Aumento em conversões</div>
                </div>
                <div className="openai-card p-6" role="article">
                  <div className="openai-heading text-3xl mb-2" aria-label="Disponível 24 horas por dia, 7 dias por semana">24/7</div>
                  <div className="openai-caption">Sempre disponível</div>
                </div>
                <div className="openai-card p-6" role="article">
                  <div className="openai-heading text-3xl mb-2" aria-label="99.9% de tempo de funcionamento">99.9%</div>
                  <div className="openai-caption">Disponibilidade</div>
                </div>
                <div className="openai-card p-6" role="article">
                  <div className="openai-heading text-3xl mb-2" aria-label="Tempo de resposta de 1.2 segundos">1.2s</div>
                  <div className="openai-caption">Tempo de resposta</div>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Features Section estilo OpenAI */}
        <section className="py-24 bg-gray-950 border-t border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">Criado para converter</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                Nossos agentes conversacionais combinam raciocínio avançado com técnicas de vendas comprovadas para maximizar suas taxas de conversão.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="openai-card-interactive p-8 group">
                <div className="w-12 h-12 elevation-1 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="openai-heading text-xl mb-4 group-hover:text-blue-300 transition-openai">Conversas inteligentes</h3>
                <p className="openai-body">
                  Compreenda a intenção do cliente, lide com objeções naturalmente e guie prospects através do seu funil de vendas com IA conversacional.
                </p>
              </div>

              <div className="openai-card-interactive p-8 group">
                <div className="w-12 h-12 elevation-1 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="openai-heading text-xl mb-4 group-hover:text-emerald-300 transition-openai">Aprendizado contínuo</h3>
                <p className="openai-body">
                  Os agentes aprendem com cada interação, melhorando continuamente suas respostas e estratégias de conversão.
                </p>
              </div>

              <div className="openai-card-interactive p-8 group">
                <div className="w-12 h-12 elevation-1 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="openai-heading text-xl mb-4 group-hover:text-purple-300 transition-openai">Insights de performance</h3>
                <p className="openai-body">
                  Acompanhe métricas de conversão, identifique gargalos e otimize seu processo de vendas com análises detalhadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section estilo OpenAI */}
        <section className="py-24 bg-gradient-to-b from-gray-950 to-black border-t border-gray-800/50">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="openai-heading text-4xl md:text-5xl mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="openai-body text-xl mb-12 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que já usam agentes conversacionais com IA para aumentar suas taxas de conversão.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup"
                className="btn-openai-primary px-8 py-4 text-lg"
              >
                Comece Gratuitamente
              </Link>
              <Link 
                href="/demo"
                className="btn-openai-secondary px-8 py-4 text-lg"
              >
                Agendar Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer estilo OpenAI */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-semibold text-white">Agentes de Conversão</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Criando IA conversacional avançada que transforma a experiência do cliente e aumenta conversões para empresas de todos os portes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Research</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/research" className="hover:text-white transition-colors">Overview</Link></li>
                <li><Link href="/index" className="hover:text-white transition-colors">Index</Link></li>
                <li><Link href="/gpt-4" className="hover:text-white transition-colors">GPT-4</Link></li>
                <li><Link href="/dall-e" className="hover:text-white transition-colors">DALL·E 2</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">API</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/api" className="hover:text-white transition-colors">Overview</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/examples" className="hover:text-white transition-colors">Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors">Safety</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>© 2024 Agentes de Conversão, Inc.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-white transition-colors">Terms & policies</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy policy</Link>
              <Link href="/brand" className="hover:text-white transition-colors">Brand guidelines</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}