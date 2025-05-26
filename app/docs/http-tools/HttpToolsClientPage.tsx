"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function HttpToolsClientPage() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-700">
        Nossas ferramentas HTTP ajudam você a testar, depurar e otimizar suas integrações com a plataforma Agentes de
        Conversão.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Dica</AlertTitle>
        <AlertDescription>
          Todas as ferramentas HTTP estão disponíveis tanto via interface web quanto via API.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="request-inspector">
        <TabsList>
          <TabsTrigger value="request-inspector">Inspetor de Requisições</TabsTrigger>
          <TabsTrigger value="webhook-tester">Testador de Webhook</TabsTrigger>
          <TabsTrigger value="api-status">Status da API</TabsTrigger>
        </TabsList>

        <TabsContent value="request-inspector" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inspetor de Requisições</CardTitle>
              <CardDescription>Analise detalhes das requisições feitas para a API</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                O Inspetor de Requisições permite que você visualize e analise todas as requisições feitas para a API da
                plataforma Agentes de Conversão. Isso é útil para depurar problemas de integração e entender como sua
                aplicação está interagindo com nossa API.
              </p>

              <h4 className="mb-2 font-medium">Recursos</h4>
              <ul className="list-disc pl-5">
                <li className="mb-1">Histórico completo de requisições</li>
                <li className="mb-1">Detalhes de cabeçalhos, corpo e resposta</li>
                <li className="mb-1">Filtros por endpoint, método e código de status</li>
                <li className="mb-1">Análise de tempo de resposta</li>
                <li>Exportação de logs para análise offline</li>
              </ul>

              <h4 className="mb-2 mt-4 font-medium">Como Acessar</h4>
              <p>
                Acesse o Inspetor de Requisições através do painel de controle em Ferramentas {">"} Inspetor de
                Requisições, ou via API em <code>/api/tools/request-inspector</code>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exemplo de Uso</CardTitle>
              <CardDescription>Como utilizar o Inspetor de Requisições</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="mb-2 font-medium">Via API</h4>
              <pre className="rounded bg-gray-100 p-4">
                {`GET /api/tools/request-inspector
{
  "filters": {
    "endpoint": "/api/agents",
    "method": "POST",
    "status_code": 400,
    "start_date": "2023-06-01T00:00:00Z",
    "end_date": "2023-06-15T23:59:59Z"
  },
  "limit": 10,
  "offset": 0
}`}
              </pre>

              <h4 className="mb-2 mt-4 font-medium">Resposta</h4>
              <pre className="rounded bg-gray-100 p-4">
                {`{
  "requests": [
    {
      "id": "req_123",
      "timestamp": "2023-06-10T14:25:30Z",
      "method": "POST",
      "endpoint": "/api/agents",
      "status_code": 400,
      "response_time_ms": 120,
      "headers": {
        "content-type": "application/json",
        "authorization": "Bearer sk_*****"
      },
      "body": {
        "name": "Novo Agente",
        "description": null
      },
      "response": {
        "error": "description is required"
      }
    },
    ...
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook-tester" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Testador de Webhook</CardTitle>
              <CardDescription>Teste seus endpoints de webhook antes de configurá-los</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                O Testador de Webhook permite que você envie eventos de teste para seus endpoints de webhook, ajudando a
                verificar se sua aplicação está processando corretamente as notificações.
              </p>

              <h4 className="mb-2 font-medium">Recursos</h4>
              <ul className="list-disc pl-5">
                <li className="mb-1">Envio de eventos de teste para qualquer URL</li>
                <li className="mb-1">Simulação de todos os tipos de eventos</li>
                <li className="mb-1">Visualização da resposta do seu endpoint</li>
                <li className="mb-1">Análise de tempo de resposta</li>
                <li>Histórico de testes realizados</li>
              </ul>

              <h4 className="mb-2 mt-4 font-medium">Como Usar</h4>
              <ol className="list-decimal pl-5">
                <li className="mb-1">Acesse o Testador de Webhook no painel de controle</li>
                <li className="mb-1">Insira a URL do seu endpoint</li>
                <li className="mb-1">Selecione o tipo de evento que deseja simular</li>
                <li className="mb-1">Personalize os dados do evento (opcional)</li>
                <li>Clique em &quot;Enviar Teste&quot;</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exemplo de Uso via API</CardTitle>
              <CardDescription>Como utilizar o Testador de Webhook via API</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="rounded bg-gray-100 p-4">
                {`POST /api/tools/webhook-tester
{
  "url": "https://seu-site.com/webhook",
  "event": "conversation.created",
  "data": {
    "id": "conv_test_123",
    "agent_id": "agent_456",
    "user_id": "user_789",
    "created_at": "2023-06-15T12:30:45Z"
  },
  "include_signature": true
}`}
              </pre>

              <h4 className="mb-2 mt-4 font-medium">Resposta</h4>
              <pre className="rounded bg-gray-100 p-4">
                {`{
  "success": true,
  "request": {
    "url": "https://seu-site.com/webhook",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "x-webhook-signature": "abcdef1234567890",
      "x-webhook-timestamp": "1623760245"
    },
    "body": {
      "event": "conversation.created",
      "timestamp": "2023-06-15T12:30:45Z",
      "data": {
        "id": "conv_test_123",
        "agent_id": "agent_456",
        "user_id": "user_789",
        "created_at": "2023-06-15T12:30:45Z"
      }
    }
  },
  "response": {
    "status_code": 200,
    "body": {
      "received": true
    },
    "response_time_ms": 85
  }
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-status" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Status da API</CardTitle>
              <CardDescription>Verifique o status e a performance da API</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                A ferramenta de Status da API fornece informações em tempo real sobre a disponibilidade e performance da
                API da plataforma Agentes de Conversão.
              </p>

              <h4 className="mb-2 font-medium">Métricas Disponíveis</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Métrica</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Uptime</TableCell>
                    <TableCell>Porcentagem de tempo em que a API esteve disponível</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tempo de Resposta</TableCell>
                    <TableCell>Tempo médio de resposta para requisições à API</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Taxa de Erro</TableCell>
                    <TableCell>Porcentagem de requisições que resultaram em erro</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Incidentes</TableCell>
                    <TableCell>Lista de incidentes recentes e seu status</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h4 className="mb-2 mt-4 font-medium">Verificação via API</h4>
              <pre className="rounded bg-gray-100 p-4">{`GET /api/tools/status`}</pre>

              <h4 className="mb-2 mt-4 font-medium">Resposta</h4>
              <pre className="rounded bg-gray-100 p-4">
                {`{
  "status": "operational",
  "updated_at": "2023-06-15T12:45:00Z",
  "metrics": {
    "uptime_percentage": 99.98,
    "average_response_time_ms": 120,
    "error_rate_percentage": 0.02
  },
  "incidents": [
    {
      "id": "inc_123",
      "title": "Latência elevada na API de Conversas",
      "status": "resolved",
      "created_at": "2023-06-10T08:15:00Z",
      "resolved_at": "2023-06-10T09:30:00Z"
    }
  ],
  "components": [
    {
      "name": "API Core",
      "status": "operational"
    },
    {
      "name": "Webhooks",
      "status": "operational"
    },
    {
      "name": "Base de Conhecimento",
      "status": "operational"
    }
  ]
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
