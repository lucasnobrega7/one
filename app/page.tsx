"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Brain, MessageSquare, BarChart3, Play, CheckCircle, Zap } from "lucide-react"
import { OpenAIButton } from "@/components/ui/openai-button"
import { OpenAICard } from "@/components/ui/openai-card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-base text-white">
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
          {/* Background gradient - Dark-tech */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-mid/10 via-accent-start/10 to-surface-base"></div>
          
          {/* Geometric mesh overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="geometric-mesh"></div>
          </div>
          
          <div className="relative pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in bg-gradient-to-r from-accent-start/20 to-accent-mid/20 border border-surface-stroke">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                Integrado com WhatsApp, Website e APIs
              </div>

              <h1 className="openai-heading text-5xl md:text-7xl mb-8 bg-gradient-to-r from-white via-accent-start to-accent-mid bg-clip-text text-transparent animate-slide-up">
                Crie Agentes de IA em minutos
              </h1>

              <p className="openai-body text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
                Transforme visitantes em clientes com agentes conversacionais inteligentes.<br />
                <span className="text-accent-start font-medium">Sem código, sem complicação. Apenas resultados.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <OpenAIButton 
                  variant="primary" 
                  size="lg"
                  className="px-8 py-4 text-lg group hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <Link href="/auth/signup">
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </OpenAIButton>
                <OpenAIButton 
                  variant="secondary" 
                  size="lg"
                  className="px-8 py-4 text-lg group hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <Link href="/demo">
                    <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Ver Demo Ao Vivo
                  </Link>
                </OpenAIButton>
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
        </section>        {/* Features Section Dark-tech */}
        <section className="py-24 bg-surface-raised border-t border-surface-stroke">
          <div className="max-w-7xl mx-auto px-6">
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

        {/* CTA Section Dark-tech */}
        <section className="py-24 bg-gradient-to-b from-surface-raised to-surface-base border-t border-surface-stroke">
          <div className="max-w-4xl mx-auto text-center px-6">
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

      {/* Footer Dark-tech */}
      <footer className="bg-surface-base border-t border-surface-stroke">
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