import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Referência da API | Agentes de Conversão",
  description: "Documentação completa de todos os endpoints disponíveis na API Agentes de Conversão",
}

export default function ApiReferencePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Referência da API</h1>

      <div className="prose max-w-none">
        <p className="lead">
          Esta página contém a documentação completa de todos os endpoints disponíveis na API Agentes de Conversão.
        </p>

        <h2>Autenticação</h2>
        <p>
          Todas as requisições à API devem incluir um token de autenticação no cabeçalho <code>Authorization</code>.
          Para obter um token, faça login na plataforma e acesse a seção de API Keys no painel de controle.
        </p>

        <pre className="bg-gray-100 p-4 rounded-md">
          <code>Authorization: Bearer seu_token_aqui</code>
        </pre>

        <h2>Endpoints</h2>

        <h3>Agentes</h3>
        <ul>
          <li>
            <code>GET /api/agents</code> - Lista todos os agentes
          </li>
          <li>
            <code>POST /api/agents</code> - Cria um novo agente
          </li>
          <li>
            <code>GET /api/agents/:id</code> - Obtém detalhes de um agente específico
          </li>
          <li>
            <code>PUT /api/agents/:id</code> - Atualiza um agente existente
          </li>
          <li>
            <code>DELETE /api/agents/:id</code> - Remove um agente
          </li>
        </ul>

        <h3>Conversas</h3>
        <ul>
          <li>
            <code>GET /api/conversations</code> - Lista todas as conversas
          </li>
          <li>
            <code>POST /api/conversations</code> - Inicia uma nova conversa
          </li>
          <li>
            <code>GET /api/conversations/:id</code> - Obtém detalhes de uma conversa específica
          </li>
          <li>
            <code>POST /api/conversations/:id/messages</code> - Adiciona uma mensagem a uma conversa
          </li>
        </ul>
      </div>
    </div>
  )
}
