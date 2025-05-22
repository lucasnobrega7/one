import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Webhooks | Agentes de Conversão",
  description: "Configure webhooks para receber notificações de eventos dos seus agentes",
}

export default function WebhooksPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Webhooks</h1>

      <div className="prose max-w-none">
        <p className="lead">
          Os webhooks permitem que sua aplicação receba notificações em tempo real quando eventos específicos ocorrem na
          plataforma Agentes de Conversão.
        </p>

        <h2>Configuração</h2>
        <p>
          Para configurar um webhook, acesse o painel de controle e navegue até a seção de Webhooks. Você precisará
          fornecer uma URL para a qual enviaremos as notificações e selecionar os eventos que deseja monitorar.
        </p>

        <h2>Formato das Notificações</h2>
        <p>As notificações são enviadas como requisições HTTP POST para a URL configurada, com o seguinte formato:</p>

        <pre className="bg-gray-100 p-4 rounded-md">
          <code>
            {`{
  "event": "conversation.created",
  "timestamp": "2023-05-15T14:30:00Z",
  "data": {
    "conversation_id": "conv_123456",
    "agent_id": "agent_789012",
    "user_id": "user_345678"
  }
}`}
          </code>
        </pre>

        <h2>Eventos Disponíveis</h2>
        <ul>
          <li>
            <code>agent.created</code> - Um novo agente foi criado
          </li>
          <li>
            <code>agent.updated</code> - Um agente foi atualizado
          </li>
          <li>
            <code>agent.deleted</code> - Um agente foi removido
          </li>
          <li>
            <code>conversation.created</code> - Uma nova conversa foi iniciada
          </li>
          <li>
            <code>conversation.message.added</code> - Uma mensagem foi adicionada a uma conversa
          </li>
          <li>
            <code>knowledge.document.uploaded</code> - Um documento foi adicionado à base de conhecimento
          </li>
        </ul>
      </div>
    </div>
  )
}
