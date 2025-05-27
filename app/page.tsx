"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Brain, MessageSquare, BarChart3, Play, CheckCircle, Zap } from "lucide-react"
import { OpenAIButton } from "@/components/ui/openai-button"
import { OpenAICard } from "@/components/ui/openai-card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-base text-white">
      {/* Enhanced Header with OpenAI-style container */}
      <header className="w-full openai-nav sticky top-0 z-50 backdrop-blur-lg bg-surface-base/90 border-b border-surface-stroke/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-start to-accent-mid rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-accent-start to-accent-mid bg-clip-text text-transparent">
                Agentes de Conversão
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/research" className="text-gray-300 hover:text-accent-start transition-colors duration-200 font-medium">Pesquisa</Link>
              <Link href="/api" className="text-gray-300 hover:text-accent-start transition-colors duration-200 font-medium">API</Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-accent-start transition-colors duration-200 font-medium">Dashboard</Link>
              <Link href="/safety" className="text-gray-300 hover:text-accent-start transition-colors duration-200 font-medium">Segurança</Link>
              <Link href="/about" className="text-gray-300 hover:text-accent-start transition-colors duration-200 font-medium">Empresa</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-surface-hover"
              >
                Entrar
              </Link>
              <Link 
                href="/auth/signup"
                className="bg-gradient-to-r from-accent-start to-accent-mid text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
                aria-label="Criar conta gratuita para usar Agentes de Conversão"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with better spacing and visual hierarchy */}
      <main className="relative">
        {/* Hero Section with OpenAI-style full-bleed background */}
        <section className="w-full relative overflow-hidden min-h-[90vh] flex items-center py-16 sm:py-20 lg:py-24">
          {/* Enhanced Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-start/10 via-accent-mid/5 to-surface-base"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(70,178,224,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(138,83,210,0.1),transparent_50%)]"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 bg-surface-raised border border-surface-stroke px-6 py-3 rounded-2xl text-sm font-medium mb-12 animate-fade-in backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Sparkles className="w-5 h-5 text-accent-start" />
                Integrado com WhatsApp, Website e 300+ APIs de IA
              </div>

              {/* Enhanced Heading with better typography */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight tracking-tight animate-slide-up">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Crie Agentes de IA
                </span>
                <br />
                <span className="bg-gradient-to-r from-accent-start via-accent-mid to-accent-end bg-clip-text text-transparent">
                  em minutos
                </span>
              </h1>

              {/* Enhanced Description */}
              <p className="text-xl md:text-3xl mb-16 max-w-4xl mx-auto leading-relaxed text-gray-300 animate-fade-in" style={{animationDelay: '0.2s'}}>
                Transforme visitantes em clientes com agentes conversacionais inteligentes que aprendem e evoluem.
                <br />
                <span className="text-accent-start font-semibold">87% de margem de lucro</span> com nossa tecnologia OpenRouter.
              </p>

              {/* Enhanced CTAs with better visual hierarchy */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <Link 
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-accent-start to-accent-mid text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-accent-start/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <Link 
                  href="/dashboard/flow"
                  className="group bg-surface-raised border-2 border-surface-stroke text-white px-12 py-5 rounded-2xl text-xl font-bold hover:border-accent-start hover:shadow-xl hover:shadow-accent-start/10 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Ver Demo Interativo
                </Link>
              </div>

              {/* Stats grid com micro-interações */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-fade-in" style={{animationDelay: '0.6s'}} role="group" aria-label="Estatísticas de performance dos agentes">
                <OpenAICard variant="elevated" className="p-6 group hover:scale-105 transition-all duration-300" role="article">
                  <div className="flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400 mr-2" />
                    <div className="openai-heading text-3xl" aria-label="45% de aumento na conversão">45%+</div>
                  </div>
                  <div className="openai-caption">Aumento em conversões</div>
                  <div className="h-1 bg-emerald-400/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[45%] group-hover:w-[60%] transition-all duration-500"></div>
                  </div>
                </OpenAICard>
                <OpenAICard variant="elevated" className="p-6 group hover:scale-105 transition-all duration-300" role="article">
                  <div className="flex items-center justify-center mb-3">
                    <Zap className="w-6 h-6 text-blue-400 mr-2" />
                    <div className="openai-heading text-3xl" aria-label="Disponível 24 horas por dia, 7 dias por semana">24/7</div>
                  </div>
                  <div className="openai-caption">Sempre disponível</div>
                  <div className="h-1 bg-blue-400/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full w-full group-hover:animate-pulse"></div>
                  </div>
                </OpenAICard>
                <OpenAICard variant="elevated" className="p-6 group hover:scale-105 transition-all duration-300" role="article">
                  <div className="flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-purple-400 mr-2" />
                    <div className="openai-heading text-3xl" aria-label="99.9% de tempo de funcionamento">99.9%</div>
                  </div>
                  <div className="openai-caption">Disponibilidade</div>
                  <div className="h-1 bg-purple-400/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full w-[99%] group-hover:w-full transition-all duration-500"></div>
                  </div>
                </OpenAICard>
                <OpenAICard variant="elevated" className="p-6 group hover:scale-105 transition-all duration-300" role="article">
                  <div className="flex items-center justify-center mb-3">
                    <Zap className="w-6 h-6 text-orange-400 mr-2" />
                    <div className="openai-heading text-3xl" aria-label="Tempo de resposta de 1.2 segundos">1.2s</div>
                  </div>
                  <div className="openai-caption">Tempo de resposta</div>
                  <div className="h-1 bg-orange-400/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full w-[85%] group-hover:w-[95%] transition-all duration-500"></div>
                  </div>
                </OpenAICard>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section com OpenAI-style container */}
        <section className="w-full bg-gray-950 border-t border-gray-800/50 py-16 sm:py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">Criado para converter</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                Nossos agentes conversacionais combinam raciocínio avançado com técnicas de vendas comprovadas para maximizar suas taxas de conversão.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <OpenAICard variant="interactive" className="p-8 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.1s'}}>
                <div className="w-16 h-16 elevation-2 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                  <MessageSquare className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                </div>
                <h3 className="openai-heading text-xl mb-4 group-hover:text-blue-300 transition-openai">Conversas inteligentes</h3>
                <p className="openai-body mb-4">
                  Compreenda a intenção do cliente, lide com objeções naturalmente e guie prospects através do seu funil de vendas com IA conversacional.
                </p>
                <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Processamento de linguagem natural
                </div>
              </OpenAICard>

              <OpenAICard variant="interactive" className="p-8 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 elevation-2 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                  <Brain className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300" />
                </div>
                <h3 className="openai-heading text-xl mb-4 group-hover:text-emerald-300 transition-openai">Aprendizado contínuo</h3>
                <p className="openai-body mb-4">
                  Os agentes aprendem com cada interação, melhorando continuamente suas respostas e estratégias de conversão.
                </p>
                <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Machine learning adaptativo
                </div>
              </OpenAICard>

              <OpenAICard variant="interactive" className="p-8 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.3s'}}>
                <div className="w-16 h-16 elevation-2 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                  <BarChart3 className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                </div>
                <h3 className="openai-heading text-xl mb-4 group-hover:text-purple-300 transition-openai">Insights de performance</h3>
                <p className="openai-body mb-4">
                  Acompanhe métricas de conversão, identifique gargalos e otimize seu processo de vendas com análises detalhadas.
                </p>
                <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Analytics em tempo real
                </div>
              </OpenAICard>
            </div>
          </div>
        </section>

        {/* CTA Section com OpenAI-style container */}
        <section className="w-full bg-gradient-to-b from-gray-950 to-black border-t border-gray-800/50 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h2 className="openai-heading text-4xl md:text-5xl mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="openai-body text-xl mb-12 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que já usam agentes conversacionais com IA para aumentar suas taxas de conversão.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <OpenAIButton 
                variant="primary" 
                size="lg"
                className="px-8 py-4 text-lg group hover:scale-105 transition-all duration-200"
                asChild
              >
                <Link href="/auth/signup">
                  Comece Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </OpenAIButton>
              <OpenAIButton 
                variant="ghost" 
                size="lg"
                className="px-8 py-4 text-lg group hover:scale-105 transition-all duration-200"
                asChild
              >
                <Link href="/demo">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Agendar Demo
                </Link>
              </OpenAIButton>
            </div>
          </div>
        </section>
      </main>

      {/* Footer com OpenAI-style container */}
      <footer className="w-full bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
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