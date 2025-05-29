"use client"

import Link from "next/link"
import { ArrowRight, Play, MessageSquare, Clock, Brain, Target, BarChart3, Zap, Users } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Logo variant="default" size="lg" className="text-white" />
              <div className="hidden md:flex items-center space-x-6">
                <Link href="#como-funciona" className="text-gray-300 hover:text-white transition-colors">
                  Como Funciona
                </Link>
                <Link href="#resultados" className="text-gray-300 hover:text-white transition-colors">
                  Resultados
                </Link>
                <a href="https://docs.agentesdeconversao.ai/" className="text-gray-300 hover:text-white transition-colors">
                  Documentação
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://login.agentesdeconversao.ai/login" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Entrar
              </a>
              <a 
                href="https://login.agentesdeconversao.ai/signup"
                className="bg-white text-black hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                Começar agora
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-medium">AGENTES DE CONVERSÃO</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Vendas</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                reimaginadas.
              </span>
            </h1>
          </div>
        </section>

        {/* Perfect Seller Section */}
        <section className="py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-12">
              Imagine o vendedor perfeito.
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-4 text-xl lg:text-2xl text-gray-300 mb-16">
              <p>Nunca dorme. Nunca esquece. Nunca falha.</p>
              <p>Conhece cada cliente. Sente cada momento. Fecha cada venda.</p>
              <p>Aprende sempre. Custa quase nada. Escala ao infinito.</p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-8">
                Esse vendedor chegou.
              </h3>
            </div>

            <a 
              href="https://login.agentesdeconversao.ai/signup"
              className="inline-flex items-center bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-2xl"
            >
              Descobrir como
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </section>

        {/* Not a Bot Section */}
        <section className="py-20 lg:py-24 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              <span className="text-white">Não chamamos de bot.</span>
              <br />
              <span className="text-white">Porque não é.</span>
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-4 text-xl lg:text-2xl text-gray-300 mb-16">
              <p>Inteligência que conversa.</p>
              <p>Precisão que encanta.</p>
              <p>Resultados que transformam.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-2">24</div>
                <div className="text-gray-400 text-lg">horas</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-2">7</div>
                <div className="text-gray-400 text-lg">dias</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-400 text-lg">vendas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
              WhatsApp. Instagram. Facebook. Seu site.
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300">
              Onde seus clientes estão, seus agentes estão.
            </p>
          </div>
        </section>

        {/* Why Superior Section */}
        <section className="py-20 lg:py-24 bg-white/[0.02]" id="como-funciona">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
                Por que superam vendedores humanos.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Memória perfeita</h3>
                <p className="text-gray-400">Lembra cada detalhe de milhares de conversas</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Resposta instantânea</h3>
                <p className="text-gray-400">0,3 segundos para qualquer pergunta</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sempre no ponto</h3>
                <p className="text-gray-400">Nunca erra o tom, timing ou abordagem</p>
              </div>
            </div>
          </div>
        </section>

        {/* New Math Section */}
        <section className="py-20 lg:py-24" id="resultados">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-16">
              A nova matemática das vendas.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-red-500/20 to-green-500/20 border border-white/20 rounded-2xl p-8">
                <div className="flex items-center justify-center text-3xl lg:text-4xl font-bold mb-4">
                  <span className="text-red-400">R$ 8.500</span>
                  <ArrowRight className="mx-4 text-white w-8 h-8" />
                  <span className="text-green-400">R$ 297</span>
                </div>
                <p className="text-gray-400">Por mês</p>
              </div>

              <div className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-white/20 rounded-2xl p-8">
                <div className="flex items-center justify-center text-2xl lg:text-3xl font-bold mb-4">
                  <span className="text-orange-400">Equipe inteira</span>
                  <ArrowRight className="mx-4 text-white w-6 h-6" />
                  <span className="text-blue-400">Um agente</span>
                </div>
                <p className="text-gray-400">Mesmos resultados</p>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 rounded-2xl p-8">
                <div className="flex items-center justify-center text-2xl lg:text-3xl font-bold mb-4">
                  <span className="text-purple-400">Meses</span>
                  <ArrowRight className="mx-4 text-white w-6 h-6" />
                  <span className="text-pink-400">Minutos</span>
                </div>
                <p className="text-gray-400">Para implementar</p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 rounded-2xl p-8">
                <div className="flex items-center justify-center text-xl lg:text-2xl font-bold mb-4">
                  <span className="text-blue-400">Humana</span>
                  <ArrowRight className="mx-4 text-white w-6 h-6" />
                  <span className="text-green-400">Sobre-humana</span>
                </div>
                <p className="text-gray-400">Performance garantida</p>
              </div>
            </div>
          </div>
        </section>

        {/* How is it Possible Section */}
        <section className="py-20 lg:py-24 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
              Como isso é possível?
            </h2>
            
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-12">
              Criado por quem entende vendas.
            </h3>

            <div className="max-w-4xl mx-auto space-y-6 text-lg lg:text-xl text-gray-300 mb-16">
              <p>Desenvolvido obsessivamente para converter.</p>
              <p>Cada interação, otimizada por IA.</p>
              <p>Cada conversa, uma oportunidade real.</p>
            </div>

            {/* Platform Pills */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {["WhatsApp", "Website", "CRM"].map((platform) => (
                <div 
                  key={platform}
                  className="bg-white/10 border border-white/20 px-8 py-4 rounded-full text-white font-semibold text-lg backdrop-blur-sm"
                >
                  {platform}
                </div>
              ))}
            </div>

            <p className="text-xl lg:text-2xl font-bold text-white">
              Conectado. Inteligente. Seu.
            </p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
              As melhores empresas já mudaram.
            </h2>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-400 mb-12">
              As outras ainda não sabem.
            </h3>

            <div className="max-w-4xl mx-auto space-y-6 text-lg lg:text-xl text-gray-300 mb-12">
              <p>O futuro não espera.</p>
              <p>Suas vendas também não deveriam.</p>
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-12">
              De qual lado você está?
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://login.agentesdeconversao.ai/signup"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center shadow-2xl"
              >
                Começar agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <Link 
                href="/demo"
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 backdrop-blur-sm flex items-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Ver demonstração
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Agentes de Conversão</h2>
            <p className="text-slate-400">Disponível hoje.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 mb-12">
            <div className="text-center">
              <h4 className="font-semibold mb-4 text-white">Produto</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="https://dash.agentesdeconversao.ai/" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="https://docs.agentesdeconversao.ai/" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="https://api.agentesdeconversao.ai/" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold mb-4 text-white">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400">
            <p>© 2025 Agentes de Conversão.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Termos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}