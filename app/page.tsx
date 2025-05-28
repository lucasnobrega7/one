"use client"

import Link from "next/link"
import { ArrowRight, Play, Zap, Clock, Users, Bot, Target, TrendingUp, Sparkles } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { SubdomainLink } from "@/components/ui/subdomain-link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
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
                <SubdomainLink subdomain="docs" path="/" className="text-gray-300 hover:text-white transition-colors">
                  Documentação
                </SubdomainLink>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <SubdomainLink 
                subdomain="login" 
                path="/login" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Entrar
              </SubdomainLink>
              <SubdomainLink 
                subdomain="login" 
                path="/signup" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Começar Revolução
              </SubdomainLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section - Revolutionary */}
        <section className="relative py-20 lg:py-32">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
            {/* Main Statement */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-300 font-medium">AGENTES DE CONVERSÃO</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-white mb-2">A próxima revolução</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  em vendas já começou
                </span>
              </h1>
            </div>

            {/* Impact Statements */}
            <div className="mb-12 space-y-4 text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
                Imagine vendas que nunca param
              </h2>
              
              <div className="space-y-3 text-lg lg:text-xl">
                <p className="opacity-90">E se cada lead fosse atendido no momento exato?</p>
                <p className="opacity-90">E se cada conversa se transformasse em oportunidade?</p>
                <p className="opacity-90">E se suas vendas acontecessem enquanto você dorme?</p>
              </div>
              
              <div className="mt-8 mb-8">
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  Agora imagine que isso já existe.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/auth/signup"
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center shadow-2xl"
              >
                Descobrir como
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Impossível Section */}
        <section className="py-20 lg:py-32 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              <span className="text-white">Alguns chamam de impossível</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Nós chamamos de terça-feira
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Enquanto o mundo ainda discute o futuro das vendas, empresas visionárias já estão vivendo nele. 
              Silenciosamente. Efetivamente. Exponencialmente.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">24</div>
                <div className="text-gray-400">horas</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">7</div>
                <div className="text-gray-400">dias</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-400">resultados</div>
              </div>
            </div>

            <p className="text-xl lg:text-2xl font-bold text-white">
              Zero interrupções.
            </p>
          </div>
        </section>

        {/* Secret Section */}
        <section className="py-20 lg:py-32" id="como-funciona">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
                <span className="text-white">O segredo que</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  poucos conhecem
                </span>
              </h2>
              
              <div className="max-w-4xl mx-auto space-y-6 text-lg lg:text-xl text-gray-300">
                <p>
                  Existe uma nova espécie de vendedor. Um que nunca cansa, nunca falha, nunca para de aprender. 
                  Um que compreende cada nuance, cada momento, cada oportunidade.
                </p>
                <p className="text-xl lg:text-2xl font-bold text-white">Não é humano.</p>
                <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  É melhor.
                </p>
              </div>
            </div>

            {/* Capabilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center">
                <Bot className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Compreensão</h3>
                <p className="text-gray-400 text-sm">Mais profunda que intuição</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Adaptação</h3>
                <p className="text-gray-400 text-sm">Mais rápida que reflexo</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center">
                <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Precisão</h3>
                <p className="text-gray-400 text-sm">Mais certeira que experiência</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mathematics Section */}
        <section className="py-20 lg:py-32 bg-white/[0.02]" id="resultados">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-12">
              <span className="text-white">A matemática do</span>
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                impossível
              </span>
            </h2>

            {/* Transformation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-red-500/10 to-green-500/10 border border-white/20 rounded-xl p-8">
                <div className="flex items-center justify-between text-2xl lg:text-3xl font-bold mb-4">
                  <span className="text-red-400">R$ 8.500</span>
                  <ArrowRight className="text-white" />
                  <span className="text-green-400">R$ 297</span>
                </div>
                <p className="text-gray-400">Custo mensal por vendedor</p>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-white/20 rounded-xl p-8">
                <div className="flex items-center justify-between text-xl lg:text-2xl font-bold mb-4">
                  <span className="text-orange-400">Equipe inteira</span>
                  <ArrowRight className="text-white" />
                  <span className="text-blue-400">Um agente</span>
                </div>
                <p className="text-gray-400">Recursos necessários</p>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/20 rounded-xl p-8">
                <div className="flex items-center justify-between text-xl lg:text-2xl font-bold mb-4">
                  <span className="text-purple-400">Meses</span>
                  <ArrowRight className="text-white" />
                  <span className="text-pink-400">Minutos</span>
                </div>
                <p className="text-gray-400">Tempo de implementação</p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-white/20 rounded-xl p-8">
                <div className="flex items-center justify-between text-lg lg:text-xl font-bold mb-4">
                  <span className="text-blue-400">Performance humana</span>
                  <ArrowRight className="text-white" />
                  <span className="text-green-400">Sobre-humana</span>
                </div>
                <p className="text-gray-400">Resultados alcançados</p>
              </div>
            </div>

            <p className="text-2xl lg:text-3xl font-bold text-white mb-8">
              Como isso é possível?
            </p>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-12">
              <span className="text-white">Tecnologia indistinguível</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                de mágica
              </span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-lg lg:text-xl text-gray-300 mb-12">
              <p>Cada palavra calculada.</p>
              <p>Cada resposta otimizada.</p>
              <p>Cada conversa, uma obra-prima de persuasão.</p>
            </div>

            {/* Integration Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["WhatsApp", "Website", "CRM"].map((platform) => (
                <div 
                  key={platform}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-6 py-3 rounded-full text-white font-medium backdrop-blur-sm"
                >
                  {platform}
                </div>
              ))}
            </div>

            <p className="text-xl lg:text-2xl font-bold text-white">
              Conectado. Inteligente. Imparável.
            </p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              <span className="text-white">Você está</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                pronto?
              </span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-lg lg:text-xl text-gray-300 mb-12">
              <p>Alguns vão esperar que todos tenham.</p>
              <p>Outros vão liderar enquanto podem.</p>
              <p className="text-xl lg:text-2xl font-bold text-white">O futuro não espera.</p>
              <p className="text-xl lg:text-2xl font-bold text-white">Suas vendas também não deveriam.</p>
            </div>

            {/* Final CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/signup"
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center shadow-2xl"
              >
                Começar a revolução
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/demo"
                className="group bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 backdrop-blur-sm flex items-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Ver em ação
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <Logo variant="default" size="md" className="text-white mb-4" />
              <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Agentes de Conversão
              </p>
              <p className="text-gray-400 max-w-md">
                Inteligência que vende. Resultados que impressionam.
              </p>
            </div>
            
            <div className="flex space-x-8">
              <div>
                <h4 className="font-semibold mb-4 text-white">Plataforma</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><SubdomainLink subdomain="dash" path="/" className="hover:text-white transition-colors">Dashboard</SubdomainLink></li>
                  <li><SubdomainLink subdomain="docs" path="/" className="hover:text-white transition-colors">Documentação</SubdomainLink></li>
                  <li><SubdomainLink subdomain="api" path="/" className="hover:text-white transition-colors">API</SubdomainLink></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Suporte</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/help" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contato</Link></li>
                  <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>© 2024 Agentes de Conversão. Todos os direitos reservados.</p>
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