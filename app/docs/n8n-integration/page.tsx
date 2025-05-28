import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Integração com N8N | Agentes de Conversão",
  description: "Como integrar seus agentes com o N8N para automação de fluxos de trabalho",
}

export default function N8nIntegrationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-white/90">Integração com N8N</h1>

      <div className="prose max-w-none prose-invert">
        <p className="lead text-white/70 text-lg mb-8">
          A integração com o N8N permite que você crie fluxos de trabalho automatizados que interagem com a plataforma
          Agentes de Conversão.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white/90">Configuração</h2>
        <p className="text-white/70 mb-4">Para configurar a integração com o N8N, siga os passos abaixo:</p>
        <ol className="list-decimal pl-5 space-y-2 text-white/70 mb-8">
          <li>Instale o N8N em seu ambiente ou use o serviço hospedado n8n.io</li>
          <li>Instale o nó &quot;Agentes de Conversão&quot; através do menu de nós do N8N</li>
          <li>Configure suas credenciais de API no nó</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4 text-white/90">Nós Disponíveis</h2>
        <p className="text-white/70 mb-4">A integração com o N8N oferece os seguintes nós:</p>
        <ul className="list-disc pl-5 space-y-2 text-white/70 mb-8">
          <li>
            <strong className="text-white/90">Agentes</strong> - Crie, atualize e gerencie agentes
          </li>
          <li>
            <strong className="text-white/90">Conversas</strong> - Inicie e gerencie conversas com agentes
          </li>
          <li>
            <strong className="text-white/90">Conhecimento</strong> - Gerencie a base de conhecimento dos agentes
          </li>
          <li>
            <strong className="text-white/90">Webhook Trigger</strong> - Inicie fluxos de trabalho com base em eventos da plataforma
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-6 text-white/90">Exemplo de Fluxo de Trabalho</h2>
        <p className="text-white/70 mb-4">
          Aqui está um exemplo de fluxo de trabalho que cria um ticket no Zendesk quando uma conversa é marcada como não
          resolvida:
        </p>

        <pre className="bg-[#0e0e10] border border-[#27272a] p-4 rounded-lg text-[#46B2E0] text-sm overflow-x-auto">
          <code>
            {`[
  {
    "name": "Webhook Trigger",
    "type": "n8n-nodes-base.webhookTrigger",
    "parameters": {
      "event": "conversation.status.changed",
      "status": "unresolved"
    }
  },
  {
    "name": "Zendesk",
    "type": "n8n-nodes-base.zendesk",
    "parameters": {
      "operation": "create",
      "resource": "ticket",
      "subject": "Conversa não resolvida: {{$node.WebhookTrigger.data.conversation_id}}",
      "description": "O agente não conseguiu resolver a conversa. Por favor, verifique."
    }
  }
]`}
          </code>
        </pre>
      </div>
    </div>
  )
}
