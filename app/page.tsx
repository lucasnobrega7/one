"use client"

import Link from "next/link"
import { ArrowRight, Play, Brain, MessageSquare, BarChart3, Sparkles, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header - OpenAI Light Style */}
      <header className="w-full sticky top-0 z-50 openai-nav">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-700 transition-colors duration-150">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Agentes de Conversão
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/research" className="text-slate-600 hover:text-indigo-600 transition-colors duration-150 font-medium">Pesquisa</Link>
              <Link href="/api" className="text-slate-600 hover:text-indigo-600 transition-colors duration-150 font-medium">API</Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors duration-150 font-medium">Dashboard</Link>
              <Link href="/safety" className="text-slate-600 hover:text-indigo-600 transition-colors duration-150 font-medium">Segurança</Link>
              <Link href="/about" className="text-slate-600 hover:text-indigo-600 transition-colors duration-150 font-medium">Empresa</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-slate-600 hover:text-slate-900 transition-colors duration-150 font-medium px-4 py-2 rounded-lg hover:bg-slate-50"
              >
                Entrar
              </Link>
              <Link 
                href="/auth/signup"
                className="btn-openai-primary px-6 py-3 text-sm font-semibold"
                aria-label="Criar conta gratuita para usar Agentes de Conversão"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - OpenAI Style */}
      <main className="relative">
        <section className="w-full relative overflow-hidden py-24 sm:py-32 lg:py-40">
          {/* Subtle background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-white to-slate-50/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(79,70,229,0.03),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.02),transparent_50%)]"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-6 py-3 rounded-2xl text-sm font-medium mb-12 animate-fade-in">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span className="text-indigo-700">Integrado com WhatsApp, Website e APIs avançadas de IA</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-8 lg:mb-10 leading-tight tracking-tighter text-slate-900 animate-slide-up">
              Crie Agentes de IA
              <br />
              <span className="text-indigo-600">em minutos</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl mb-10 lg:mb-14 max-w-3xl mx-auto leading-relaxed text-slate-600 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Desenvolva agentes conversacionais avançados. Integre IA que aprende, adapta-se e transforma interações em resultados tangíveis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-16 lg:mb-20 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link 
                href="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-white text-lg font-semibold px-10 py-4 rounded-lg transition-colors duration-150 ease-in-out transform hover:scale-105 flex items-center group"
              >
                Explorar Plataforma
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-150" />
              </Link>
              <Link 
                href="/dashboard/flow"
                className="text-indigo-600 hover:text-indigo-800 font-semibold px-10 py-4 rounded-lg transition-colors duration-150 flex items-center group"
              >
                <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-150" />
                Ver Demo Interativo
              </Link>
            </div>

            {/* Benefits Grid */}
            <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="group">
                <div className="flex justify-center mb-3">
                  <Brain className="openai-icon-lg" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg mb-1">Inteligência Adaptativa</h3>
                <p className="text-slate-600 text-base leading-relaxed">Aprende e evolui continuamente com cada interação.</p>
              </div>
              
              <div className="group">
                <div className="flex justify-center mb-3">
                  <MessageSquare className="openai-icon-lg" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg mb-1">Engajamento Superior</h3>
                <p className="text-slate-600 text-base leading-relaxed">Conecta-se de forma natural e eficaz com seus clientes.</p>
              </div>
              
              <div className="group">
                <div className="flex justify-center mb-3">
                  <BarChart3 className="openai-icon-lg" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg mb-1">Resultados Mensuráveis</h3>
                <p className="text-slate-600 text-base leading-relaxed">Otimiza conversões e performance de forma contínua.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full bg-slate-50 py-24 sm:py-32 lg:py-40">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 lg:mb-24">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                Plataforma Inteligente. Resultados Exponenciais.
              </h2>
              <p className="text-xl text-slate-600 text-center max-w-3xl mx-auto leading-relaxed">
                Nossos agentes são construídos com uma arquitetura de IA de ponta, projetada para maximizar a conversão e a eficiência operacional em cada interação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              <div className="openai-card-elevated p-8 lg:p-10 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.1s'}}>
                <div className="mb-5">
                  <MessageSquare className="openai-icon-lg mb-4" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">Compreensão Contextual Profunda</h3>
                <p className="text-base lg:text-lg leading-relaxed text-slate-600">
                  Analisa nuances conversacionais, identifica intenções complexas e responde com precisão contextual incomparável.
                </p>
                <div className="flex items-center text-indigo-600 text-sm font-medium mt-4 group-hover:text-indigo-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Processamento de linguagem natural avançado
                </div>
              </div>

              <div className="openai-card-elevated p-8 lg:p-10 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.2s'}}>
                <div className="mb-5">
                  <Brain className="openai-icon-lg mb-4" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">Aprendizado Contínuo e Adaptativo</h3>
                <p className="text-base lg:text-lg leading-relaxed text-slate-600">
                  Evolui constantemente através de machine learning, refinando estratégias e otimizando resultados automaticamente.
                </p>
                <div className="flex items-center text-indigo-600 text-sm font-medium mt-4 group-hover:text-indigo-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Machine learning adaptativo em tempo real
                </div>
              </div>

              <div className="openai-card-elevated p-8 lg:p-10 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.3s'}}>
                <div className="mb-5">
                  <BarChart3 className="openai-icon-lg mb-4" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-3">Analytics e Insights Avançados</h3>
                <p className="text-base lg:text-lg leading-relaxed text-slate-600">
                  Monitora performance em tempo real, identifica padrões e fornece insights acionáveis para otimização contínua.
                </p>
                <div className="flex items-center text-indigo-600 text-sm font-medium mt-4 group-hover:text-indigo-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Dashboard de analytics em tempo real
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-indigo-50 py-24 sm:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-5">
              Inicie Sua Transformação Digital com IA
            </h2>
            <p className="text-lg lg:text-xl leading-relaxed text-slate-700 text-center max-w-3xl mx-auto mb-10 lg:mb-12">
              Junte-se às empresas que estão redefinindo o futuro da interação com o cliente. Crie seu primeiro agente inteligente hoje e experiencie o poder da nossa plataforma.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link 
                href="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors duration-150 transform hover:scale-105 flex items-center justify-center group"
              >
                Comece Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/demo"
                className="text-indigo-600 hover:text-indigo-800 bg-transparent border-2 border-indigo-600 hover:bg-indigo-50 hover:border-indigo-600 font-semibold px-8 py-4 rounded-lg transition-all duration-150 transform hover:scale-105 flex items-center justify-center group"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Agendar Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - OpenAI Light Style */}
      <footer className="w-full bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-slate-900">Agentes de Conversão</span>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Criando IA conversacional avançada que transforma a experiência do cliente e otimiza resultados para empresas visionárias.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Research</h4>
              <ul className="space-y-3 text-slate-600">
                <li><Link href="/research" className="hover:text-indigo-600 transition-colors">Overview</Link></li>
                <li><Link href="/index" className="hover:text-indigo-600 transition-colors">Index</Link></li>
                <li><Link href="/models" className="hover:text-indigo-600 transition-colors">Modelos</Link></li>
                <li><Link href="/safety" className="hover:text-indigo-600 transition-colors">Safety</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">API</h4>
              <ul className="space-y-3 text-slate-600">
                <li><Link href="/api" className="hover:text-indigo-600 transition-colors">Overview</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-indigo-600 transition-colors">Documentation</Link></li>
                <li><Link href="/examples" className="hover:text-indigo-600 transition-colors">Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Company</h4>
              <ul className="space-y-3 text-slate-600">
                <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
                <li><Link href="/safety" className="hover:text-indigo-600 transition-colors">Safety</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500">
            <p>© 2024 Agentes de Conversão, Inc.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms & policies</Link>
              <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy policy</Link>
              <Link href="/brand" className="hover:text-indigo-600 transition-colors">Brand guidelines</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}