"use client"

import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight, MessageSquare, Pencil, BarChart3, ImageIcon, Code, Zap } from "lucide-react"

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MainLayout>
        <section className="container mx-auto px-4 md:px-6 py-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-normal mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              API de Agentes Conversacionais
            </h1>
            <p className="text-xl mb-8 text-gray-300 leading-relaxed">
              Integre agentes inteligentes em suas aplicações. Nossa API compatível com OpenAI permite interações 
              com fluxos conversacionais personalizados, base de conhecimento e automações avançadas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/api/docs"
                className="bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center font-medium"
              >
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="/api/pricing" 
                className="border border-gray-600 text-gray-300 py-3 px-6 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
              >
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
          <h2 className="text-3xl font-normal mb-10">Primeiros Passos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 border border-white/10">
              <h3 className="text-xl font-normal mb-4">Tutorial Rápido</h3>
              <p className="text-white/70 mb-6">Aprenda criando seu primeiro agente conversacional em 5 minutos</p>
              <Link href="/api/docs/quickstart" className="text-sm underline hover:no-underline">
                Começar tutorial
              </Link>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-8 border border-white/10">
              <h3 className="text-xl font-normal mb-4">Exemplos Práticos</h3>
              <p className="text-white/70 mb-6">Explore casos de uso reais e implementações prontas</p>
              <Link href="/api/examples" className="text-sm underline hover:no-underline">
                Explorar exemplos
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
          <h2 className="text-3xl font-normal mb-10">Endpoints da API</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-t border-white/20 pt-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-purple-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-normal mb-1">Chat com Agente</h3>
                  <p className="text-white/70 text-sm">Interaja com agentes conversacionais personalizados</p>
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded text-xs mb-3 font-mono">
                POST /api/agents/{'{'}id{'}'}/chat
              </div>
              <Link href="/api/docs/agents" className="text-sm underline hover:no-underline">
                Ver documentação
              </Link>
            </div>

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-green-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-normal mb-1">Base de Conhecimento</h3>
                  <p className="text-white/70 text-sm">Gerencie documentos e dados dos agentes</p>
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded text-xs mb-3 font-mono">
                GET /api/knowledge
              </div>
              <Link href="/api/docs/knowledge" className="text-sm underline hover:no-underline">
                Ver documentação
              </Link>
            </div>

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-normal mb-1">Fluxos Conversacionais</h3>
                  <p className="text-white/70 text-sm">Execute e monitore fluxos de conversação</p>
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded text-xs mb-3 font-mono">
                POST /api/flows/{'{'}id{'}'}/execute
              </div>
              <Link href="/api/docs/flows" className="text-sm underline hover:no-underline">
                Ver documentação
              </Link>
            </div>

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-pink-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-normal mb-1">Integrações</h3>
                  <p className="text-white/70 text-sm">Conecte com WhatsApp, websites e outros canais</p>
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded text-xs mb-3 font-mono">
                POST /api/integrations/webhook
              </div>
              <Link href="/api/docs/integrations" className="text-sm underline hover:no-underline">
                Ver documentação
              </Link>
            </div>

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-normal mb-1">Campanhas</h3>
                  <p className="text-white/70 text-sm">Gerencie campanhas proativas de mensagens</p>
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded text-xs mb-3 font-mono">
                POST /api/campaigns
              </div>
              <Link href="/api/docs/campaigns" className="text-sm underline hover:no-underline">
                Ver documentação
              </Link>
            </div>

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-teal-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-normal mb-1">Análise e Métricas</h3>
                  <p className="text-white/70 text-sm">Monitore performance e engajamento dos agentes</p>
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded text-xs mb-3 font-mono">
                GET /api/analytics
              </div>
              <Link href="/api/docs/analytics" className="text-sm underline hover:no-underline">
                Ver documentação
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
          <h2 className="text-3xl font-normal mb-10">Exemplo de uso</h2>
          
          <div className="bg-gray-900/50 border border-white/10 p-6 rounded-lg max-w-4xl">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-400 text-sm ml-2">Terminal</span>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`curl -X POST "https://api.agentesdeconversao.com/v1/agents/123/chat" \
  -H "Authorization: Bearer sk-proj-..." \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Olá, preciso de ajuda com meu pedido"
      }
    ],
    "stream": true,
    "context": {
      "user_id": "user_123",
      "session_id": "session_456"
    }
  }'`}</code>
            </pre>
          </div>
          
          <div className="mt-6 text-gray-400">
            <p>Resposta compatível com formato OpenAI Chat Completions:</p>
          </div>
          
          <div className="bg-gray-900/50 border border-white/10 p-6 rounded-lg max-w-4xl mt-4">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1700000000,
  "model": "agente-conversacional-v1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Olá! Ficarei feliz em ajudar com seu pedido. Pode me fornecer o número do pedido ou mais detalhes?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 25,
    "total_tokens": 37
  }
}`}</code>
            </pre>
          </div>
        </section>
      </MainLayout>
    </div>
  )
}