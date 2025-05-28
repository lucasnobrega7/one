"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function HttpToolsClientPage() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-white/70">
        Nossas ferramentas HTTP ajudam você a testar, depurar e otimizar suas integrações com a plataforma Agentes de
        Conversão.
      </p>

      <Alert className="bg-[#1a1a1d] border-[#27272a]">
        <Info className="h-4 w-4 text-[#46B2E0]" />
        <AlertTitle className="text-white/90">Dica</AlertTitle>
        <AlertDescription className="text-white/70">
          Todas as ferramentas HTTP estão disponíveis tanto via interface web quanto via API.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="request-inspector">
        <TabsList className="bg-[#1a1a1d] border-[#27272a]">
          <TabsTrigger value="request-inspector" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Inspetor de Requisições</TabsTrigger>
          <TabsTrigger value="webhook-tester" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Testador de Webhook</TabsTrigger>
          <TabsTrigger value="api-status" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Status da API</TabsTrigger>
        </TabsList>

        <TabsContent value="request-inspector" className="space-y-4 pt-4">
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white/90">Inspetor de Requisições</CardTitle>
              <CardDescription className="text-white/70">Analise detalhes das requisições feitas para a API</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white/70">
                O Inspetor de Requisições permite que você visualize e analise todas as requisições feitas para a API da
                plataforma Agentes de Conversão. Isso é útil para depurar problemas de integração e entender como sua
                aplicação está interagindo com nossa API.
              </p>

              <h4 className="mb-2 font-medium text-white/90">Recursos</h4>
              <ul className="list-disc pl-5 text-white/70">
                <li className="mb-1">Histórico completo de requisições</li>
                <li className="mb-1">Detalhes de cabeçalhos, corpo e resposta</li>
                <li className="mb-1">Filtros por endpoint, método e código de status</li>
                <li className="mb-1">Análise de tempo de resposta</li>
                <li>Exportação de logs para análise offline</li>
              </ul>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Como Acessar</h4>
              <p className="text-white/70">
                Acesse o Inspetor de Requisições através do painel de controle em Ferramentas {">"} Inspetor de
                Requisições, ou via API em <code className="bg-[#0e0e10] text-[#E056A0] px-2 py-1 rounded text-sm">/api/tools/request-inspector</code>.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white/90">Exemplo de Uso</CardTitle>
              <CardDescription className="text-white/70">Como utilizar o Inspetor de Requisições</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="mb-2 font-medium text-white/90">Via API</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
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

              <h4 className="mb-2 mt-4 font-medium text-white/90">Resposta</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#8A53D2] text-sm overflow-x-auto">
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
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white/90">Testador de Webhook</CardTitle>
              <CardDescription className="text-white/70">Teste seus endpoints de webhook antes de configurá-los</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white/70">
                O Testador de Webhook permite que você envie eventos de teste para seus endpoints de webhook, ajudando a
                verificar se sua aplicação está processando corretamente as notificações.
              </p>

              <h4 className="mb-2 font-medium text-white/90">Recursos</h4>
              <ul className="list-disc pl-5 text-white/70">
                <li className="mb-1">Envio de eventos de teste para qualquer URL</li>
                <li className="mb-1">Simulação de todos os tipos de eventos</li>
                <li className="mb-1">Visualização da resposta do seu endpoint</li>
                <li className="mb-1">Análise de tempo de resposta</li>
                <li>Histórico de testes realizados</li>
              </ul>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Como Usar</h4>
              <ol className="list-decimal pl-5 text-white/70">
                <li className="mb-1">Acesse o Testador de Webhook no painel de controle</li>
                <li className="mb-1">Insira a URL do seu endpoint</li>
                <li className="mb-1">Selecione o tipo de evento que deseja simular</li>
                <li className="mb-1">Personalize os dados do evento (opcional)</li>
                <li>Clique em &quot;Enviar Teste&quot;</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white/90">Exemplo de Uso via API</CardTitle>
              <CardDescription className="text-white/70">Como utilizar o Testador de Webhook via API</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
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

              <h4 className="mb-2 mt-4 font-medium text-white/90">Resposta</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#8A53D2] text-sm overflow-x-auto">
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
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white/90">Status da API</CardTitle>
              <CardDescription className="text-white/70">Verifique o status e a performance da API</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white/70">
                A ferramenta de Status da API fornece informações em tempo real sobre a disponibilidade e performance da
                API da plataforma Agentes de Conversão.
              </p>

              <h4 className="mb-2 font-medium text-white/90">Métricas Disponíveis</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#27272a]">
                      <TableHead className="text-white/90">Métrica</TableHead>
                      <TableHead className="text-white/90">Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-[#27272a]">
                      <TableCell className="text-white/70">Uptime</TableCell>
                      <TableCell className="text-white/70">Porcentagem de tempo em que a API esteve disponível</TableCell>
                    </TableRow>
                    <TableRow className="border-[#27272a]">
                      <TableCell className="text-white/70">Tempo de Resposta</TableCell>
                      <TableCell className="text-white/70">Tempo médio de resposta para requisições à API</TableCell>
                    </TableRow>
                    <TableRow className="border-[#27272a]">
                      <TableCell className="text-white/70">Taxa de Erro</TableCell>
                      <TableCell className="text-white/70">Porcentagem de requisições que resultaram em erro</TableCell>
                    </TableRow>
                    <TableRow className="border-[#27272a]">
                      <TableCell className="text-white/70">Incidentes</TableCell>
                      <TableCell className="text-white/70">Lista de incidentes recentes e seu status</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Verificação via API</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#E056A0] text-sm">{`GET /api/tools/status`}</pre>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Resposta</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
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