import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Integração com N8N | Agentes de Conversão",
  description: "Como integrar seus agentes com o N8N para automação de fluxos de trabalho",
}

export default function N8nIntegrationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Integração com N8N</h1>

      <div className="prose max-w-none">
        <p className="lead">
          A integração com o N8N permite que você crie fluxos de trabalho automatizados que interagem com a plataforma
          Agentes de Conversão.
        </p>

        <h2>Configuração</h2>
        <p>Para configurar a integração com o N8N, siga os passos abaixo:</p>
        <ol>
          <li>Instale o N8N em seu ambiente ou use o serviço hospedado n8n.io</li>
          <li>Instale o nó "Agentes de Conversão" através do menu de nós do N8N</li>
          <li>Configure suas credenciais de API no nó</li>
        </ol>

        <h2>Nós Disponíveis</h2>
        <p>A integração com o N8N oferece os seguintes nós:</p>
        <ul>
          <li>
            <strong>Agentes</strong> - Crie, atualize e gerencie agentes
          </li>
          <li>
            <strong>Conversas</strong> - Inicie e gerencie conversas com agentes
          </li>
          <li>
            <strong>Conhecimento</strong> - Gerencie a base de conhecimento dos agentes
          </li>
          <li>
            <strong>Webhook Trigger</strong> - Inicie fluxos de trabalho com base em eventos da plataforma
          </li>
        </ul>

        <h2>Exemplo de Fluxo de Trabalho</h2>
        <p>
          Aqui está um exemplo de fluxo de trabalho que cria um ticket no Zendesk quando uma conversa é marcada como não
          resolvida:
        </p>

        <pre className="bg-gray-100 p-4 rounded-md">
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
