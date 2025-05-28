import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Webhooks | Agentes de Conversão",
  description: "Configure webhooks para receber notificações de eventos dos seus agentes",
}

export default function WebhooksPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-white/90">Webhooks</h1>

      <div className="prose max-w-none prose-invert">
        <p className="lead text-white/70 text-lg mb-8">
          Os webhooks permitem que sua aplicação receba notificações em tempo real quando eventos específicos ocorrem na
          plataforma Agentes de Conversão.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-white/90">Configuração</h2>
        <p className="text-white/70 mb-8">
          Para configurar um webhook, acesse o painel de controle e navegue até a seção de Webhooks. Você precisará
          fornecer uma URL para a qual enviaremos as notificações e selecionar os eventos que deseja monitorar.
        </p>

        <h2 className="text-2xl font-semibold mb-6 text-white/90">Formato das Notificações</h2>
        <p className="text-white/70 mb-4">As notificações são enviadas como requisições HTTP POST para a URL configurada, com o seguinte formato:</p>

        <pre className="bg-[#0e0e10] border border-[#27272a] p-4 rounded-lg text-[#46B2E0] text-sm overflow-x-auto mb-8">
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

        <h2 className="text-2xl font-semibold mb-4 text-white/90">Eventos Disponíveis</h2>
        <ul className="list-disc pl-5 space-y-2 text-white/70">
          <li>
            <code className="bg-[#1a1a1d] text-[#E056A0] px-2 py-1 rounded text-sm">agent.created</code> - Um novo agente foi criado
          </li>
          <li>
            <code className="bg-[#1a1a1d] text-[#E056A0] px-2 py-1 rounded text-sm">agent.updated</code> - Um agente foi atualizado
          </li>
          <li>
            <code className="bg-[#1a1a1d] text-red-400 px-2 py-1 rounded text-sm">agent.deleted</code> - Um agente foi removido
          </li>
          <li>
            <code className="bg-[#1a1a1d] text-[#46B2E0] px-2 py-1 rounded text-sm">conversation.created</code> - Uma nova conversa foi iniciada
          </li>
          <li>
            <code className="bg-[#1a1a1d] text-[#8A53D2] px-2 py-1 rounded text-sm">conversation.message.added</code> - Uma mensagem foi adicionada a uma conversa
          </li>
          <li>
            <code className="bg-[#1a1a1d] text-[#46B2E0] px-2 py-1 rounded text-sm">knowledge.document.uploaded</code> - Um documento foi adicionado à base de conhecimento
          </li>
        </ul>
      </div>
    </div>
  )
}
