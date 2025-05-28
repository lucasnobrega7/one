import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Referência da API | Agentes de Conversão",
  description: "Documentação completa de todos os endpoints disponíveis na API Agentes de Conversão",
}

export default function ApiReferencePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-white/90">Referência da API</h1>

      <div className="prose max-w-none prose-invert">
        <p className="lead text-white/70 text-lg mb-8">
          Esta página contém a documentação completa de todos os endpoints disponíveis na API Agentes de Conversão.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white/90">Autenticação</h2>
        <p className="text-white/70 mb-4">
          Todas as requisições à API devem incluir um token de autenticação no cabeçalho <code className="bg-[#1a1a1d] text-[#E056A0] px-2 py-1 rounded text-sm">Authorization</code>.
          Para obter um token, faça login na plataforma e acesse a seção de API Keys no painel de controle.
        </p>

        <pre className="bg-[#0e0e10] border border-[#27272a] p-4 rounded-lg text-[#46B2E0] text-sm overflow-x-auto">
          <code>Authorization: Bearer seu_token_aqui</code>
        </pre>

        <h2 className="text-2xl font-semibold mb-6 mt-12 text-white/90">Endpoints</h2>

        <h3 className="text-xl font-semibold mb-4 text-white/90">Agentes</h3>
        <ul className="space-y-2 mb-8">
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-[#46B2E0] px-2 py-1 rounded text-sm mr-2">GET /api/agents</code> - Lista todos os agentes
          </li>
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-[#8A53D2] px-2 py-1 rounded text-sm mr-2">POST /api/agents</code> - Cria um novo agente
          </li>
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-[#46B2E0] px-2 py-1 rounded text-sm mr-2">GET /api/agents/:id</code> - Obtém detalhes de um agente específico
          </li>
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-[#E056A0] px-2 py-1 rounded text-sm mr-2">PUT /api/agents/:id</code> - Atualiza um agente existente
          </li>
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-red-400 px-2 py-1 rounded text-sm mr-2">DELETE /api/agents/:id</code> - Remove um agente
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-4 text-white/90">Conversas</h3>
        <ul className="space-y-2">
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-[#46B2E0] px-2 py-1 rounded text-sm mr-2">GET /api/conversations</code> - Lista todas as conversas
          </li>
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-[#8A53D2] px-2 py-1 rounded text-sm mr-2">POST /api/conversations</code> - Inicia uma nova conversa
          </li>
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-[#46B2E0] px-2 py-1 rounded text-sm mr-2">GET /api/conversations/:id</code> - Obtém detalhes de uma conversa específica
          </li>
          <li className="text-white/70">
            <code className="bg-[#1a1a1d] text-[#8A53D2] px-2 py-1 rounded text-sm mr-2">POST /api/conversations/:id/messages</code> - Adiciona uma mensagem a uma conversa
          </li>
        </ul>
      </div>
    </div>
  )
}
