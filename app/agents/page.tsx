import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { Bot, Plus } from "lucide-react"

export default function AgentsPage() {
  return (
    <MainLayout>
      <section className="container py-20">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-7xl mb-10">Agentes de Conversão</h1>
          <p className="text-2xl font-normal mb-10 leading-tight">
            Nossos agentes de IA são projetados para interagir de forma natural, responder perguntas complexas e ajudar
            a aumentar suas taxas de conversão.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/agents/new" className="openai-button flex items-center">
              Criar novo agente
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2"
              >
                <path
                  d="M6.5 3.5L11 8L6.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="/knowledge" className="openai-link">
              Gerenciar bases de conhecimento
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center text-xl mb-4">
              <Bot className="mr-2 h-5 w-5" />
              <h3>Assistente de Vendas</h3>
            </div>
            <p className="text-white/70 mb-6">
              Qualifica leads e responde dúvidas sobre produtos, ajudando a aumentar suas taxas de conversão.
            </p>
            <div className="flex justify-between">
              <span className="text-sm text-white/50">Criado em: 10/05/2023</span>
              <Link href="/agents/1/chat" className="text-sm underline hover:no-underline">
                Conversar
              </Link>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center text-xl mb-4">
              <Bot className="mr-2 h-5 w-5" />
              <h3>Suporte ao Cliente</h3>
            </div>
            <p className="text-white/70 mb-6">
              Responde dúvidas frequentes e ajuda a resolver problemas comuns, melhorando a experiência do cliente.
            </p>
            <div className="flex justify-between">
              <span className="text-sm text-white/50">Criado em: 15/05/2023</span>
              <Link href="/agents/2/chat" className="text-sm underline hover:no-underline">
                Conversar
              </Link>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center text-xl mb-4">
              <Plus className="mr-2 h-5 w-5" />
              <h3>Criar novo agente</h3>
            </div>
            <p className="text-white/70 mb-6">
              Crie um agente personalizado para atender às necessidades específicas do seu negócio.
            </p>
            <div className="flex justify-end">
              <Link href="/agents/new" className="text-sm underline hover:no-underline">
                Começar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20 border-t border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <h2 className="text-4xl font-normal mb-6">Casos de uso</h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-2xl font-normal mb-10 leading-tight">
              Nossos agentes são utilizados em diversos setores para melhorar a experiência do cliente e aumentar as
              taxas de conversão.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Openai.png-Zhh08WG6eZvLq45wtit1HqtkvzqpFH.jpeg"
                  alt="E-commerce"
                  className="aspect-square object-cover mb-4"
                />
                <h4 className="font-bold text-sm mb-1">E-commerce</h4>
                <p className="text-sm text-white/70">
                  Agentes que ajudam clientes a encontrar produtos e finalizar compras.
                </p>
              </div>

              <div>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Educação"
                  className="aspect-square object-cover mb-4"
                />
                <h4 className="font-bold text-sm mb-1">Educação</h4>
                <p className="text-sm text-white/70">
                  Agentes que auxiliam estudantes em seu processo de aprendizagem.
                </p>
              </div>

              <div>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Finanças"
                  className="aspect-square object-cover mb-4"
                />
                <h4 className="font-bold text-sm mb-1">Finanças</h4>
                <p className="text-sm text-white/70">
                  Agentes que fornecem orientação financeira e suporte ao cliente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
