"use client"

import Link from "next/link"
import { ArrowRight, Play, Brain, MessageSquare, BarChart3, CheckCircle, Zap, Clock, Users } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { SubdomainLink } from "@/components/ui/subdomain-link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header - OpenAI Light Style */}
      <header className="w-full sticky top-0 z-50 openai-nav-light">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="default" size="lg" />
            
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/research" className="text-gray-600 hover:text-blue-600 transition-colors duration-150 font-medium">Pesquisa</Link>
              <SubdomainLink subdomain="docs" path="/docs" className="text-gray-600 hover:text-blue-600 transition-colors duration-150 font-medium">API</SubdomainLink>
              <SubdomainLink subdomain="dash" path="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors duration-150 font-medium">Dashboard</SubdomainLink>
              <Link href="/safety" className="text-gray-600 hover:text-blue-600 transition-colors duration-150 font-medium">Segurança</Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-150 font-medium">Empresa</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <SubdomainLink 
                subdomain="login"
                path="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-150 font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Entrar
              </SubdomainLink>
              <SubdomainLink 
                subdomain="login"
                path="/signup"
                asButton
                variant="default"
                className="btn-openai-primary-light"
              >
                Começar Agora
              </SubdomainLink>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - OpenAI Style */}
      <main className="relative">
        <section className="w-full relative overflow-hidden bg-white py-24 sm:py-32 lg:py-32">
          {/* Subtle background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-gray-50/50"></div>
          <div className="geometric-mesh-light"></div>
          
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 px-6 py-3 rounded-2xl text-sm font-medium mb-12 animate-fade-in">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-700">Integrado com WhatsApp, Website e APIs avançadas de IA</span>
            </div>

            {/* Main Heading - Using Söhne */}
            <h1 className="sohne-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 lg:mb-10 leading-tight tracking-tighter text-gray-900 animate-slide-up">
              Crie Agentes de IA
              <br />
              <span className="text-blue-600">em minutos</span>
            </h1>

            {/* Subtitle - Updated professional content */}
            <p className="text-xl lg:text-2xl mb-10 lg:mb-14 max-w-3xl mx-auto leading-relaxed text-gray-600 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Desenvolva agentes conversacionais avançados. Integre IA que aprende, adapta-se e transforma interações em resultados tangíveis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-16 lg:mb-20 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link 
                href="/auth/signup"
                className="btn-openai-primary-light flex items-center group"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-150" />
              </Link>
              <Link 
                href="/dashboard/flow"
                className="btn-openai-ghost-light flex items-center group"
              >
                <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-150" />
                Ver Demo Interativo
              </Link>
            </div>

            {/* Benefits Grid - Updated with new metrics */}
            <div className="mt-16 lg:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="group">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-blue-500 mx-auto" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg">Eficiência Operacional</h3>
              </div>
              
              <div className="group">
                <div className="flex justify-center mb-2">
                  <Zap className="h-6 w-6 text-blue-500 mx-auto" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg">Disponibilidade Contínua</h3>
              </div>
              
              <div className="group">
                <div className="flex justify-center mb-2">
                  <Clock className="h-6 w-6 text-blue-500 mx-auto" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg">Respostas Ágeis</h3>
              </div>

              <div className="group">
                <div className="flex justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-500 mx-auto" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg">Alta Satisfação</h3>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full bg-gray-50 py-24 sm:py-32 lg:py-32">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 lg:mb-24">
              <h2 className="sohne-heading text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                Plataforma Inteligente. Resultados Exponenciais.
              </h2>
              <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
                Nossos agentes são construídos com uma arquitetura de IA de ponta, projetada para maximizar a conversão e a eficiência operacional em cada interação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              <div className="openai-card-light p-8 lg:p-10 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.1s'}}>
                <div className="mb-5">
                  <MessageSquare className="openai-icon-lg mb-4" />
                </div>
                <h3 className="sohne-heading text-xl lg:text-2xl font-semibold text-gray-900 mb-3">Compreensão Contextual Profunda</h3>
                <p className="text-base lg:text-lg leading-relaxed text-gray-600">
                  Analisa nuances conversacionais, identifica intenções complexas e responde com precisão contextual incomparável.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium mt-4 group-hover:text-blue-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Processamento de linguagem natural avançado
                </div>
              </div>

              <div className="openai-card-light p-8 lg:p-10 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.2s'}}>
                <div className="mb-5">
                  <Brain className="openai-icon-lg mb-4" />
                </div>
                <h3 className="sohne-heading text-xl lg:text-2xl font-semibold text-gray-900 mb-3">Aprendizado Contínuo e Adaptativo</h3>
                <p className="text-base lg:text-lg leading-relaxed text-gray-600">
                  Evolui constantemente através de machine learning, refinando estratégias e otimizando resultados automaticamente.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium mt-4 group-hover:text-blue-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Machine learning adaptativo em tempo real
                </div>
              </div>

              <div className="openai-card-light p-8 lg:p-10 group animate-fade-in hover:scale-[1.02] transition-all duration-300" style={{animationDelay: '0.3s'}}>
                <div className="mb-5">
                  <BarChart3 className="openai-icon-lg mb-4" />
                </div>
                <h3 className="sohne-heading text-xl lg:text-2xl font-semibold text-gray-900 mb-3">Analytics e Insights Avançados</h3>
                <p className="text-base lg:text-lg leading-relaxed text-gray-600">
                  Monitora performance em tempo real, identifica padrões e fornece insights acionáveis para otimização contínua.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium mt-4 group-hover:text-blue-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Dashboard de analytics em tempo real
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-blue-50 py-24 sm:py-32 lg:py-32">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h2 className="sohne-heading text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-5">
              Inicie Sua Transformação Digital com IA
            </h2>
            <p className="text-lg lg:text-xl leading-relaxed text-gray-700 text-center max-w-3xl mx-auto mb-10 lg:mb-12">
              Junte-se às empresas que estão redefinindo o futuro da interação com o cliente. Crie seu primeiro agente inteligente hoje e experiencie o poder da nossa plataforma.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link 
                href="/auth/signup"
                className="btn-openai-primary-light flex items-center justify-center group"
              >
                Comece Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/demo"
                className="btn-openai-ghost-light flex items-center justify-center group"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Agendar Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - OpenAI Light Style */}
      <footer className="w-full bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo variant="default" size="md" />
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Criando IA conversacional avançada que transforma a experiência do cliente e otimiza resultados para empresas visionárias.
              </p>
            </div>
            
            <div>
              <h4 className="sohne-heading font-semibold mb-4 text-gray-900">Research</h4>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/research" className="hover:text-blue-600 transition-colors">Overview</Link></li>
                <li><Link href="/index" className="hover:text-blue-600 transition-colors">Index</Link></li>
                <li><Link href="/models" className="hover:text-blue-600 transition-colors">Modelos</Link></li>
                <li><Link href="/safety" className="hover:text-blue-600 transition-colors">Safety</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="sohne-heading font-semibold mb-4 text-gray-900">API</h4>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/api" className="hover:text-blue-600 transition-colors">Overview</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-blue-600 transition-colors">Documentation</Link></li>
                <li><Link href="/examples" className="hover:text-blue-600 transition-colors">Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="sohne-heading font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link href="/safety" className="hover:text-blue-600 transition-colors">Safety</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500">
            <p>© 2024 Agentes de Conversão, Inc.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms & policies</Link>
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy policy</Link>
              <Link href="/brand" className="hover:text-blue-600 transition-colors">Brand guidelines</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}