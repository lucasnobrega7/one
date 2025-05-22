"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info } from "lucide-react"

export default function WebhooksClientPage() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-700">
        Os webhooks permitem que sua aplicação receba notificações em tempo real sobre eventos que ocorrem na plataforma
        Agentes de Conversão.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Seu endpoint de webhook deve responder com um código de status 200 em até 5 segundos, caso contrário,
          consideraremos a entrega como falha e tentaremos novamente.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Configurando Webhooks</CardTitle>
          <CardDescription>Como configurar e gerenciar seus webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Para configurar um webhook, você precisa fornecer uma URL para a qual enviaremos as notificações de eventos.
            Você pode configurar webhooks através do painel de controle ou via API.
          </p>

          <h4 className="mb-2 font-medium">Via Painel de Controle</h4>
          <ol className="list-decimal pl-5">
            <li className="mb-1">Acesse o painel de controle</li>
            <li className="mb-1">Navegue até Configurações {">"} Webhooks</li>
            <li className="mb-1">Clique em "Adicionar Webhook"</li>
            <li className="mb-1">Insira a URL do seu endpoint e selecione os eventos que deseja monitorar</li>
            <li>Clique em "Salvar"</li>
          </ol>

          <h4 className="mb-2 mt-4 font-medium">Via API</h4>
          <pre className="rounded bg-gray-100 p-4">
            {`POST /api/webhooks
{
  "url": "https://seu-site.com/webhook",
  "events": ["conversation.created", "message.received"],
  "secret": "seu_segredo_aqui"
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos Disponíveis</CardTitle>
          <CardDescription>Lista de eventos que podem acionar webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>conversation.created</TableCell>
                <TableCell>Uma nova conversa foi iniciada</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>conversation.updated</TableCell>
                <TableCell>Uma conversa existente foi atualizada</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>message.received</TableCell>
                <TableCell>Uma mensagem foi recebida de um usuário</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>message.sent</TableCell>
                <TableCell>Uma mensagem foi enviada por um agente</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>agent.created</TableCell>
                <TableCell>Um novo agente foi criado</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>agent.updated</TableCell>
                <TableCell>Um agente existente foi atualizado</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>knowledge.updated</TableCell>
                <TableCell>Uma base de conhecimento foi atualizada</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formato da Carga</CardTitle>
          <CardDescription>Estrutura dos dados enviados para seu webhook</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conversation">
            <TabsList>
              <TabsTrigger value="conversation">Conversa</TabsTrigger>
              <TabsTrigger value="message">Mensagem</TabsTrigger>
              <TabsTrigger value="agent">Agente</TabsTrigger>
            </TabsList>

            <TabsContent value="conversation" className="pt-4">
              <pre className="rounded bg-gray-100 p-4">
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
              <pre className="rounded bg-gray-100 p-4">
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
              <pre className="rounded bg-gray-100 p-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>Como verificar a autenticidade das requisições de webhook</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Para garantir que as requisições de webhook são realmente da plataforma Agentes de Conversão, incluímos uma
            assinatura HMAC em cada requisição.
          </p>

          <h4 className="mb-2 font-medium">Cabeçalhos de Segurança</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cabeçalho</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>X-Webhook-Signature</TableCell>
                <TableCell>Assinatura HMAC-SHA256 do corpo da requisição</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>X-Webhook-Timestamp</TableCell>
                <TableCell>Timestamp da requisição (Unix timestamp)</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h4 className="mb-2 mt-4 font-medium">Verificando a Assinatura</h4>
          <p className="mb-2">Para verificar a assinatura, você deve:</p>
          <ol className="list-decimal pl-5">
            <li className="mb-1">Concatenar o timestamp e o corpo da requisição</li>
            <li className="mb-1">Calcular o HMAC-SHA256 usando seu segredo de webhook</li>
            <li>Comparar o resultado com o valor do cabeçalho X-Webhook-Signature</li>
          </ol>

          <h4 className="mb-2 mt-4 font-medium">Exemplo em Node.js</h4>
          <pre className="rounded bg-gray-100 p-4">
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
