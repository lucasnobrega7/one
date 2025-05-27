import Link from "next/link"
import { MessageSquare, FileText, Image, Mic, Code, Settings, CheckCircle, ArrowRight } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function DocsPage() {
  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Header */}
      <header className="w-full h-[60px] bg-white border-b border-[--openai-gray-200]">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-full px-6 lg:px-8">
          {/* Left Navigation */}
          <div className="flex items-center gap-8">
            <Logo variant="default" size="sm" />
            <nav className="flex items-center gap-8">
              <Link href="/docs" className="text-sm text-[--openai-blue] font-medium">
                Overview
              </Link>
              <Link href="/docs/documentation" className="text-sm text-[--openai-gray-600] hover:text-[--openai-gray-900] transition-colors">
                Documentation
              </Link>
              <Link href="/docs/api-reference" className="text-sm text-[--openai-gray-600] hover:text-[--openai-gray-900] transition-colors">
                API reference
              </Link>
              <Link href="/docs/examples" className="text-sm text-[--openai-gray-600] hover:text-[--openai-gray-900] transition-colors">
                Examples
              </Link>
            </nav>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm text-[--openai-gray-600] hover:text-[--openai-gray-900] transition-colors">
              Entrar
            </Link>
            <Link 
              href="/auth/signup"
              className="btn-openai-primary-light text-sm"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-16 pb-16 px-6 lg:px-8">
        
        {/* Banner */}
        <div className="openai-card-light border border-[--openai-gray-200] rounded-lg px-6 py-5 mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-[--openai-gray-900]">
              Sistema OpenRouter ativo com 300+ modelos de IA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard"
              className="bg-[--openai-gray-100] text-[--openai-gray-700] px-4 py-2 rounded-lg text-sm hover:bg-[--openai-gray-200] transition-colors"
            >
              Acessar
            </Link>
            <ArrowRight className="w-5 h-5 text-[--openai-gray-600]" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-16">
          <h1 className="sohne-heading text-5xl font-normal text-[--openai-gray-900] leading-tight mb-4">
            Explore nossa API de Agentes
          </h1>
          <p className="text-xl text-[--openai-gray-600] leading-relaxed max-w-3xl">
            Construa agentes conversacionais inteligentes que convertem visitantes em clientes usando nossa plataforma de IA.
          </p>
        </div>

        {/* Start with the basics */}
        <section className="mb-20">
          <h2 className="sohne-heading text-3xl font-normal text-[--openai-gray-900] mb-12">
            Comece com o básico
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/docs/quickstart" className="group">
              <div className="openai-card-light relative rounded-xl overflow-hidden p-8 h-48 bg-gradient-to-br from-[--openai-blue] to-[--openai-blue]/80 group-hover:shadow-openai-light-lg transition-all duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-[--openai-blue] to-[--openai-blue]/90"></div>
                <div className="relative z-10 text-white h-full flex flex-col justify-end">
                  <h3 className="text-lg font-medium mb-2">Tutorial rápido</h3>
                  <p className="text-sm opacity-90">Aprenda criando um agente de exemplo</p>
                </div>
              </div>
            </Link>
            
            <Link href="/docs/examples" className="group">
              <div className="openai-card-light relative rounded-xl overflow-hidden p-8 h-48 bg-gradient-to-br from-green-600 to-emerald-600 group-hover:shadow-openai-light-lg transition-all duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700"></div>
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
          <h2 className="sohne-heading text-3xl font-normal text-[--openai-gray-900] mb-12">
            Construa sua aplicação
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1 */}
            <Link href="/docs/chat" className="flex items-start gap-4 p-6 rounded-lg hover:bg-[--openai-gray-50] transition-colors group">
              <div className="w-14 h-14 bg-[--openai-blue] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[--openai-blue]/90 transition-colors">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-[--openai-gray-900]">Chat Conversacional</h3>
                  <span className="bg-[--openai-gray-100] text-[--openai-gray-600] px-2 py-1 rounded text-xs font-medium">
                    Ativo
                  </span>
                </div>
                <p className="text-sm text-[--openai-gray-600] leading-relaxed">
                  Aprenda a usar modelos de linguagem conversacionais
                </p>
              </div>
            </Link>

            <Link href="/docs/completions" className="flex items-start gap-4 p-6 rounded-lg hover:bg-[--openai-gray-50] transition-colors group">
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-700 transition-colors">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[--openai-gray-900] mb-2">Geração de Texto</h3>
                <p className="text-sm text-[--openai-gray-600] leading-relaxed">
                  Aprenda a gerar ou editar conteúdo textual
                </p>
              </div>
            </Link>

            {/* Row 2 */}
            <Link href="/docs/embeddings" className="flex items-start gap-4 p-6 rounded-lg hover:bg-[--openai-gray-50] transition-colors group">
              <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 transition-colors">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[--openai-gray-900] mb-2">Embeddings</h3>
                <p className="text-sm text-[--openai-gray-600] leading-relaxed">
                  Aprenda a buscar, classificar e comparar texto
                </p>
              </div>
            </Link>

            <Link href="/docs/webhooks" className="flex items-start gap-4 p-6 rounded-lg hover:bg-[--openai-gray-50] transition-colors group">
              <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-700 transition-colors">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[--openai-gray-900] mb-2">Webhooks</h3>
                <p className="text-sm text-[--openai-gray-600] leading-relaxed">
                  Integre com sistemas externos via webhooks
                </p>
              </div>
            </Link>

            {/* Row 3 */}
            <Link href="/docs/whatsapp" className="flex items-start gap-4 p-6 rounded-lg hover:bg-[--openai-gray-50] transition-colors group">
              <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[--openai-gray-900] mb-2">Integração WhatsApp</h3>
                <p className="text-sm text-[--openai-gray-600] leading-relaxed">
                  Conecte seus agentes ao WhatsApp Business
                </p>
              </div>
            </Link>

            <Link href="/docs/analytics" className="flex items-start gap-4 p-6 rounded-lg hover:bg-[--openai-gray-50] transition-colors group">
              <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[--openai-gray-900] mb-2">Analytics</h3>
                <p className="text-sm text-[--openai-gray-600] leading-relaxed">
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
