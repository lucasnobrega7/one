"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info } from "lucide-react"

export default function WebhooksClientPage() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-white/70">
        Os webhooks permitem que sua aplicação receba notificações em tempo real sobre eventos que ocorrem na plataforma
        Agentes de Conversão.
      </p>

      <Alert className="bg-[#1a1a1d] border-[#27272a]">
        <Info className="h-4 w-4 text-[#46B2E0]" />
        <AlertTitle className="text-white/90">Importante</AlertTitle>
        <AlertDescription className="text-white/70">
          Seu endpoint de webhook deve responder com um código de status 200 em até 5 segundos, caso contrário,
          consideraremos a entrega como falha e tentaremos novamente.
        </AlertDescription>
      </Alert>

      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Configurando Webhooks</CardTitle>
          <CardDescription className="text-white/70">Como configurar e gerenciar seus webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-white/70">
            Para configurar um webhook, você precisa fornecer uma URL para a qual enviaremos as notificações de eventos.
            Você pode configurar webhooks através do painel de controle ou via API.
          </p>

          <h4 className="mb-2 font-medium text-white/90">Via Painel de Controle</h4>
          <ol className="list-decimal pl-5 text-white/70 mb-6">
            <li className="mb-1">Acesse o painel de controle</li>
            <li className="mb-1">Navegue até Configurações {">"} Webhooks</li>
            <li className="mb-1">Clique em "Adicionar Webhook"</li>
            <li className="mb-1">Insira a URL do seu endpoint e selecione os eventos que deseja monitorar</li>
            <li>Clique em "Salvar"</li>
          </ol>

          <h4 className="mb-2 mt-4 font-medium text-white/90">Via API</h4>
          <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
            {`POST /api/webhooks
{
  "url": "https://seu-site.com/webhook",
  "events": ["conversation.created", "message.received"],
  "secret": "seu_segredo_aqui"
}`}
          </pre>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Eventos Disponíveis</CardTitle>
          <CardDescription className="text-white/70">Lista de eventos que podem acionar webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272a]">
                  <TableHead className="text-white/90">Evento</TableHead>
                  <TableHead className="text-white/90">Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#46B2E0] font-mono text-sm">conversation.created</TableCell>
                  <TableCell className="text-white/70">Uma nova conversa foi iniciada</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#46B2E0] font-mono text-sm">conversation.updated</TableCell>
                  <TableCell className="text-white/70">Uma conversa existente foi atualizada</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#8A53D2] font-mono text-sm">message.received</TableCell>
                  <TableCell className="text-white/70">Uma mensagem foi recebida de um usuário</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#8A53D2] font-mono text-sm">message.sent</TableCell>
                  <TableCell className="text-white/70">Uma mensagem foi enviada por um agente</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#E056A0] font-mono text-sm">agent.created</TableCell>
                  <TableCell className="text-white/70">Um novo agente foi criado</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#E056A0] font-mono text-sm">agent.updated</TableCell>
                  <TableCell className="text-white/70">Um agente existente foi atualizado</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#46B2E0] font-mono text-sm">knowledge.updated</TableCell>
                  <TableCell className="text-white/70">Uma base de conhecimento foi atualizada</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Formato da Carga</CardTitle>
          <CardDescription className="text-white/70">Estrutura dos dados enviados para seu webhook</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conversation">
            <TabsList className="bg-[#0e0e10] border-[#27272a]">
              <TabsTrigger value="conversation" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Conversa</TabsTrigger>
              <TabsTrigger value="message" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Mensagem</TabsTrigger>
              <TabsTrigger value="agent" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Agente</TabsTrigger>
            </TabsList>

            <TabsContent value="conversation" className="pt-4">
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
                {`{
  "event": "conversation.created",
  "timestamp": "2023-06-15T12:30:45Z",
  "data": {
    "id": "conv_123",
    "agent_id": "agent_456",
    "user_id": "user_789",
    "created_at": "2023-06-15T12:30:45Z",
    "updated_at": "2023-06-15T12:30:45Z",
    "metadata": {
      "source": "website",
      "page": "/pricing"
    }
  }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="message" className="pt-4">
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#8A53D2] text-sm overflow-x-auto">
                {`{
  "event": "message.received",
  "timestamp": "2023-06-15T12:31:15Z",
  "data": {
    "id": "msg_123",
    "conversation_id": "conv_123",
    "content": "Olá, gostaria de saber mais sobre os planos",
    "role": "user",
    "created_at": "2023-06-15T12:31:15Z"
  }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="agent" className="pt-4">
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#E056A0] text-sm overflow-x-auto">
                {`{
  "event": "agent.created",
  "timestamp": "2023-06-15T12:00:00Z",
  "data": {
    "id": "agent_456",
    "name": "Assistente de Vendas",
    "description": "Agente especializado em vendas",
    "created_at": "2023-06-15T12:00:00Z",
    "updated_at": "2023-06-15T12:00:00Z"
  }
}`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Segurança</CardTitle>
          <CardDescription className="text-white/70">Como verificar a autenticidade das requisições de webhook</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-white/70">
            Para garantir que as requisições de webhook são realmente da plataforma Agentes de Conversão, incluímos uma
            assinatura HMAC em cada requisição.
          </p>

          <h4 className="mb-2 font-medium text-white/90">Cabeçalhos de Segurança</h4>
          <div className="overflow-x-auto mb-6">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272a]">
                  <TableHead className="text-white/90">Cabeçalho</TableHead>
                  <TableHead className="text-white/90">Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#46B2E0] font-mono text-sm">X-Webhook-Signature</TableCell>
                  <TableCell className="text-white/70">Assinatura HMAC-SHA256 do corpo da requisição</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-[#8A53D2] font-mono text-sm">X-Webhook-Timestamp</TableCell>
                  <TableCell className="text-white/70">Timestamp da requisição (Unix timestamp)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <h4 className="mb-2 mt-4 font-medium text-white/90">Verificando a Assinatura</h4>
          <p className="mb-2 text-white/70">Para verificar a assinatura, você deve:</p>
          <ol className="list-decimal pl-5 text-white/70 mb-6">
            <li className="mb-1">Concatenar o timestamp e o corpo da requisição</li>
            <li className="mb-1">Calcular o HMAC-SHA256 usando seu segredo de webhook</li>
            <li>Comparar o resultado com o valor do cabeçalho X-Webhook-Signature</li>
          </ol>

          <h4 className="mb-2 mt-4 font-medium text-white/90">Exemplo em Node.js</h4>
          <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
            {`const crypto = require('crypto');

function verifyWebhookSignature(req, secret) {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const body = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(timestamp + body)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}