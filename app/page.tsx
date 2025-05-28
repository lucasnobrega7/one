"use client"

import { ArrowRight, Play, MessageSquare, Clock, Brain, Target, BarChart3, Zap, Users, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-inter antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold font-open-sans text-white">
                AGENTES DE CONVERSÃO
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#como-funciona" className="text-gray-500 hover:text-white transition-colors">
                  Como Funciona
                </a>
                <a href="#resultados" className="text-gray-500 hover:text-white transition-colors">
                  Resultados
                </a>
                <a href="https://docs.agentesdeconversao.ai/" className="text-gray-500 hover:text-white transition-colors">
                  Documentação
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://login.agentesdeconversao.ai/login" 
                className="text-gray-500 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Entrar
              </a>
              <a 
                href="https://login.agentesdeconversao.ai/signup"
                className="bg-white hover:bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                Começar agora
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 via-transparent to-gray-800/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-800/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-900/20 border border-gray-700/30 px-6 py-3 rounded-full text-sm mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 font-medium">AGENTES DE CONVERSÃO</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-open-sans mb-8 leading-tight">
              <span className="text-white">Imagine o</span>
              <br />
              <span className="text-gray-300">
                vendedor perfeito.
              </span>
            </h1>

            {/* Description */}
            <div className="max-w-4xl mx-auto space-y-4 text-xl lg:text-2xl text-gray-300 mb-12">
              <p>Nunca dorme. Conhece seu produto como ninguém.</p>
              <p>Conhece cada cliente. Custa quase nada. Fecha cada venda.</p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold font-open-sans text-white mb-8">
                Esse vendedor chegou.
              </h2>
            </div>

            <a 
              href="https://login.agentesdeconversao.ai/signup"
              className="inline-flex items-center bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105"
            >
              Descobrir como
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </section>

        {/* Not a Bot Section */}
        <section className="py-20 lg:py-24 bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-open-sans mb-8">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-2">24</div>
                <div className="text-gray-400 text-lg">horas</div>
              </div>
              <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-2">7</div>
                <div className="text-gray-400 text-lg">dias</div>
              </div>
              <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="text-5xl lg:text-6xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-400 text-lg">vendas</div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              WhatsApp. Instagram. Facebook. Seu site.
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12">
              Onde seus clientes estão, seus agentes estão.
            </p>

            {/* Platform Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {['WhatsApp', 'Instagram', 'Facebook', 'Website'].map((platform) => (
                <div 
                  key={platform}
                  className="flex flex-col items-center p-6 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-medium">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Superior Section */}
        <section className="py-20 lg:py-24 bg-gray-900/50" id="como-funciona">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-open-sans text-white mb-8">
                Por que superam vendedores humanos?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Memória perfeita</h3>
                <p className="text-gray-400">Lembra cada detalhe de milhares de conversas</p>
              </div>
              
              <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Resposta instantânea</h3>
                <p className="text-gray-400">0,3 segundos para qualquer pergunta</p>
              </div>
              
              <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Sempre no ponto</h3>
                <p className="text-gray-400">Nunca erra o tom, timing ou abordagem</p>
              </div>
            </div>
          </div>
        </section>

        {/* New Math Section */}
        <section className="py-20 lg:py-24" id="resultados">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-16">
              A nova matemática das vendas.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center text-3xl lg:text-4xl font-bold mb-4">
                  <span className="text-gray-400">R$ 4.500</span>
                  <ArrowRight className="mx-4 text-white w-8 h-8" />
                  <span className="text-white">R$ 497</span>
                </div>
                <p className="text-gray-400">Por mês</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center text-2xl lg:text-3xl font-bold mb-4">
                  <span className="text-gray-400">Equipe inteira</span>
                  <ArrowRight className="mx-4 text-white w-6 h-6" />
                  <span className="text-white">Um agente</span>
                </div>
                <p className="text-gray-400">Mesmos resultados</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center text-2xl lg:text-3xl font-bold mb-4">
                  <span className="text-gray-400">Meses</span>
                  <ArrowRight className="mx-4 text-white w-6 h-6" />
                  <span className="text-white">Minutos</span>
                </div>
                <p className="text-gray-400">Para implementar</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center text-xl lg:text-2xl font-bold mb-4">
                  <span className="text-gray-400">Humana</span>
                  <ArrowRight className="mx-4 text-white w-6 h-6" />
                  <span className="text-white">Sobre-humana</span>
                </div>
                <p className="text-gray-400">Performance garantida</p>
              </div>
            </div>
          </div>
        </section>

        {/* How is it Possible Section */}
        <section className="py-20 lg:py-24 bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
              Como isso é possível?
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 text-lg lg:text-xl text-gray-300 mb-16">
              <p>Criado por quem entende vendas.</p>
              <p>Desenvolvido obsessivamente para converter.</p>
            </div>

            {/* Platform Pills */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {["WhatsApp", "Website", "Instagram", "Facebook", "Ligações de voz"].map((platform) => (
                <div 
                  key={platform}
                  className="bg-gray-900/80 border border-gray-600/50 px-8 py-4 rounded-full text-white font-semibold text-lg backdrop-blur-sm hover:scale-105 transition-transform"
                >
                  {platform}
                </div>
              ))}
            </div>

            <p className="text-xl lg:text-2xl font-bold text-white">
              Conectado. Inteligente.
            </p>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
              As melhores empresas já usam Agentes de Conversão.
            </h2>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-400 mb-12">
              As outras não estão na internet.
            </h3>

            <div className="max-w-4xl mx-auto space-y-6 text-lg lg:text-xl text-gray-300 mb-12">
              <p>O futuro não espera.</p>
              <p>Suas vendas também não deveriam.</p>
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-12">
              De qual lado você está?
            </h3>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://login.agentesdeconversao.ai/signup"
                className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center"
              >
                Começar agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a 
                href="/demo"
                className="bg-gray-900/50 hover:bg-gray-800/60 border border-gray-600/50 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 backdrop-blur-sm flex items-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Ver demonstração
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-16 bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Agentes de Conversão</h2>
            <p className="text-gray-400">Democratizando excelência. Disponível hoje.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 mb-12">
            <div className="text-center">
              <h4 className="font-semibold mb-4 text-white">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://dash.agentesdeconversao.ai/" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="https://docs.agentesdeconversao.ai/" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="https://api.agentesdeconversao.ai/" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold mb-4 text-white">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="/status" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>© 2025 Agentes de Conversão.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-white transition-colors">Privacidade</a>
              <a href="/terms" className="hover:text-white transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}