import Link from "next/link"
import { MessageSquare, FileText, Image, Mic, Code, Settings, CheckCircle, ArrowRight } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function DocsPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#0e0e10]">
      {/* Header */}
      <header className="w-full h-[60px] bg-[#0e0e10] border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-full px-6 lg:px-8">
          {/* Left Navigation */}
          <div className="flex items-center gap-8">
            <Logo variant="light" size="sm" />
            <nav className="flex items-center gap-8">
              <Link href="/docs" className="text-sm text-[#46B2E0] font-medium">
                Overview
              </Link>
              <Link href="/docs/documentation" className="text-sm text-white/70 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/docs/api-reference" className="text-sm text-white/70 hover:text-white transition-colors">
                API reference
              </Link>
              <Link href="/docs/examples" className="text-sm text-white/70 hover:text-white transition-colors">
                Examples
              </Link>
            </nav>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-white/70 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-gradient-to-r from-[#46B2E0] via-[#8A53D2] to-[#E056A0] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-all duration-200"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-16 pb-16 px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-[#1a1a1d] border border-[#27272a] rounded-xl px-6 py-5 mb-16 flex items-center justify-between hover:scale-[1.01] transition-all duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#46B2E0]" />
            <span className="text-sm font-medium text-white/90">
              Sistema OpenRouter ativo com 300+ modelos de IA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard"
              className="bg-[#27272a] text-white/70 px-4 py-2 rounded-lg text-sm hover:bg-[#373739] hover:text-white transition-all duration-200"
            >
              Acessar
            </Link>
            <ArrowRight className="w-5 h-5 text-white/60" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-16">
          <h1 className="text-5xl font-normal text-white/90 leading-tight mb-4">
            Explore nossa API de Agentes
          </h1>
          <p className="text-xl text-white/70 leading-relaxed max-w-3xl">
            Construa agentes conversacionais inteligentes que convertem visitantes em clientes usando nossa plataforma de IA.
          </p>
        </div>

        {/* Start with the basics */}
        <section className="mb-20">
          <h2 className="text-3xl font-normal text-white/90 mb-12">
            Comece com o básico
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/docs/quickstart" className="group">
              <div className="relative rounded-xl overflow-hidden p-8 h-48 bg-gradient-to-br from-[#46B2E0] to-[#8A53D2] group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-[#46B2E0]/20 transition-all duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-[#46B2E0] to-[#8A53D2] opacity-90"></div>
                <div className="relative z-10 text-white h-full flex flex-col justify-end">
                  <h3 className="text-lg font-medium mb-2">Tutorial rápido</h3>
                  <p className="text-sm opacity-90">Aprenda criando um agente de exemplo</p>
                </div>
              </div>
            </Link>
            
            <Link href="/docs/examples" className="group">
              <div className="relative rounded-xl overflow-hidden p-8 h-48 bg-gradient-to-br from-[#8A53D2] to-[#E056A0] group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-[#8A53D2]/20 transition-all duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8A53D2] to-[#E056A0] opacity-90"></div>
                <div className="relative z-10 text-white h-full flex flex-col justify-end">
                  <h3 className="text-lg font-medium mb-2">Exemplos</h3>
                  <p className="text-sm opacity-90">Explore casos de uso práticos</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Build an application */}
        <section>
          <h2 className="text-3xl font-normal text-white/90 mb-12">
            Construa sua aplicação
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1 */}
            <Link href="/docs/chat" className="flex items-start gap-4 p-6 bg-[#1a1a1d] border border-[#27272a] rounded-xl hover:bg-[#1f1f23] hover:scale-[1.01] transition-all duration-200 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#46B2E0] to-[#8A53D2] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#46B2E0]/30 transition-all duration-200">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-white/90">Chat Conversacional</h3>
                  <span className="bg-[#27272a] text-[#46B2E0] px-2 py-1 rounded text-xs font-medium">
                    Ativo
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Aprenda a usar modelos de linguagem conversacionais
                </p>
              </div>
            </Link>

            <Link href="/docs/completions" className="flex items-start gap-4 p-6 bg-[#1a1a1d] border border-[#27272a] rounded-xl hover:bg-[#1f1f23] hover:scale-[1.01] transition-all duration-200 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8A53D2] to-[#E056A0] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#8A53D2]/30 transition-all duration-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white/90 mb-2">Geração de Texto</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Aprenda a gerar ou editar conteúdo textual
                </p>
              </div>
            </Link>

            {/* Row 2 */}
            <Link href="/docs/embeddings" className="flex items-start gap-4 p-6 bg-[#1a1a1d] border border-[#27272a] rounded-xl hover:bg-[#1f1f23] hover:scale-[1.01] transition-all duration-200 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E056A0] to-[#46B2E0] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#E056A0]/30 transition-all duration-200">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white/90 mb-2">Embeddings</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Aprenda a buscar, classificar e comparar texto
                </p>
              </div>
            </Link>

            <Link href="/docs/webhooks" className="flex items-start gap-4 p-6 bg-[#1a1a1d] border border-[#27272a] rounded-xl hover:bg-[#1f1f23] hover:scale-[1.01] transition-all duration-200 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#46B2E0] to-[#8A53D2] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#46B2E0]/30 transition-all duration-200">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white/90 mb-2">Webhooks</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Integre com sistemas externos via webhooks
                </p>
              </div>
            </Link>

            {/* Row 3 */}
            <Link href="/docs/whatsapp" className="flex items-start gap-4 p-6 bg-[#1a1a1d] border border-[#27272a] rounded-xl hover:bg-[#1f1f23] hover:scale-[1.01] transition-all duration-200 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8A53D2] to-[#E056A0] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#8A53D2]/30 transition-all duration-200">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white/90 mb-2">Integração WhatsApp</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Conecte seus agentes ao WhatsApp Business
                </p>
              </div>
            </Link>

            <Link href="/docs/analytics" className="flex items-start gap-4 p-6 bg-[#1a1a1d] border border-[#27272a] rounded-xl hover:bg-[#1f1f23] hover:scale-[1.01] transition-all duration-200 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E056A0] to-[#46B2E0] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[#E056A0]/30 transition-all duration-200">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white/90 mb-2">Analytics</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Monitore performance e otimize conversões
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export const dynamic = 'force-dynamic'
