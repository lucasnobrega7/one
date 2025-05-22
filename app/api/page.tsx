import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight, MessageSquare, Pencil, BarChart3, ImageIcon, Code, Zap } from "lucide-react"

export default function ApiPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal mb-8">Explore a API de Agentes de Conversão</h1>
          <p className="text-xl mb-8">
            Construa aplicações avançadas com nossa API de IA. Acesse modelos de linguagem de última geração para chat,
            geração de texto, embeddings e muito mais.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/api/docs"
              className="border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors inline-flex items-center"
            >
              Começar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/api/pricing" className="text-sm underline hover:no-underline py-2">
              Ver preços
            </Link>
          </div>
        </div>

        <div className="mt-16 border border-white/10 p-4 max-w-4xl">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-white/10 flex items-center justify-center mr-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM7 11.4L3.6 8L5.02 6.58L7 8.56L10.98 4.58L12.4 6L7 11.4Z"
                  fill="white"
                />
              </svg>
            </div>
            <span>Entre na lista de espera da API</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent border border-white/20 px-3 py-2 flex-1 focus:outline-none focus:border-white"
            />
            <button className="bg-white text-black px-4 py-2 hover:bg-white/90 transition-colors">
              Entrar na lista
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <h2 className="text-3xl font-normal mb-10">Comece com o básico</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 border border-white/10">
            <h3 className="text-xl font-normal mb-4">Tutorial rápido</h3>
            <p className="text-white/70 mb-6">Aprenda construindo um aplicativo de exemplo simples</p>
            <Link href="/api/docs/quickstart" className="text-sm underline hover:no-underline">
              Ver tutorial
            </Link>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-8 border border-white/10">
            <h3 className="text-xl font-normal mb-4">Exemplos</h3>
            <p className="text-white/70 mb-6">Explore exemplos de tarefas comuns</p>
            <Link href="/api/examples" className="text-sm underline hover:no-underline">
              Ver exemplos
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <h2 className="text-3xl font-normal mb-10">Construa uma aplicação</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 bg-purple-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-normal mb-1">Chat</h3>
                <p className="text-white/70 text-sm">Aprenda a usar modelos de linguagem baseados em chat</p>
              </div>
            </div>
            <Link href="/api/docs/chat" className="text-sm underline hover:no-underline">
              Ver documentação
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 bg-green-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-normal mb-1">Completar texto</h3>
                <p className="text-white/70 text-sm">Aprenda a gerar ou editar texto</p>
              </div>
            </div>
            <Link href="/api/docs/completions" className="text-sm underline hover:no-underline">
              Ver documentação
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-normal mb-1">Embeddings</h3>
                <p className="text-white/70 text-sm">Aprenda a pesquisar, classificar e comparar texto</p>
              </div>
            </div>
            <Link href="/api/docs/embeddings" className="text-sm underline hover:no-underline">
              Ver documentação
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 bg-pink-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-normal mb-1">Geração de imagens</h3>
                <p className="text-white/70 text-sm">Aprenda a gerar ou editar imagens</p>
              </div>
            </div>
            <Link href="/api/docs/images" className="text-sm underline hover:no-underline">
              Ver documentação
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 bg-yellow-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Code className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-normal mb-1">Completar código</h3>
                <p className="text-white/70 text-sm">Aprenda a gerar, editar ou explicar código</p>
              </div>
            </div>
            <Link href="/api/docs/code" className="text-sm underline hover:no-underline">
              Ver documentação
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 bg-teal-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-normal mb-1">Fine-tuning</h3>
                <p className="text-white/70 text-sm">Aprenda a treinar um modelo para seu caso de uso específico</p>
              </div>
            </div>
            <Link href="/api/docs/fine-tuning" className="text-sm underline hover:no-underline">
              Ver documentação
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
