"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function ApiReferenceClientPage() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-white/70">
        Nossa API RESTful permite que você integre os recursos dos Agentes de Conversão diretamente em seus aplicativos.
        Abaixo você encontrará a documentação completa de todos os endpoints disponíveis.
      </p>

      <Tabs defaultValue="agents">
        <TabsList>
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>GET /api/agents</CardTitle>
              <CardDescription>Retorna uma lista de todos os agentes disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="mb-2 font-medium text-white/90">Parâmetros de Consulta</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parâmetro</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>limit</TableCell>
                    <TableCell>number</TableCell>
                    <TableCell>Número máximo de agentes a retornar (padrão: 10)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>offset</TableCell>
                    <TableCell>number</TableCell>
                    <TableCell>Número de agentes a pular (padrão: 0)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Resposta</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
                {`{
  "agents": [
    {
      "id": "agent_123",
      "name": "Assistente de Vendas",
      "description": "Agente especializado em vendas",
      "created_at": "2023-01-01T00:00:00Z"
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

          <Card>
            <CardHeader>
              <CardTitle>POST /api/agents</CardTitle>
              <CardDescription>Cria um novo agente</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="mb-2 font-medium text-white/90">Corpo da Requisição</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#8A53D2] text-sm overflow-x-auto">
                {`{
  "name": "Novo Agente",
  "description": "Descrição do novo agente",
  "knowledge_base_ids": ["kb_123", "kb_456"],
  "settings": {
    "temperature": 0.7,
    "max_tokens": 1000
  }
}`}
              </pre>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Resposta</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
                {`{
  "id": "agent_789",
  "name": "Novo Agente",
  "description": "Descrição do novo agente",
  "created_at": "2023-06-15T12:30:45Z",
  "knowledge_base_ids": ["kb_123", "kb_456"],
  "settings": {
    "temperature": 0.7,
    "max_tokens": 1000
  }
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>GET /api/conversations</CardTitle>
              <CardDescription>Retorna uma lista de conversas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">Documentação para endpoints de conversas...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>GET /api/knowledge</CardTitle>
              <CardDescription>Retorna uma lista de bases de conhecimento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">Documentação para endpoints de base de conhecimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>GET /api/analytics</CardTitle>
              <CardDescription>Retorna dados analíticos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">Documentação para endpoints de analytics...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Autenticação</CardTitle>
          <CardDescription>Como autenticar suas requisições à API</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-white/70">Todas as requisições à API devem incluir sua chave de API no cabeçalho de autorização:</p>
          <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#E056A0] text-sm">{`Authorization: Bearer sua_chave_api_aqui`}</pre>

          <p className="mt-4 text-white/70">
            Você pode obter sua chave de API no painel de controle, na seção de configurações da API.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Códigos de Status</CardTitle>
          <CardDescription>Possíveis códigos de status retornados pela API</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Badge variant="outline">200</Badge>
                </TableCell>
                <TableCell>Sucesso</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="outline">400</Badge>
                </TableCell>
                <TableCell>Requisição inválida</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="outline">401</Badge>
                </TableCell>
                <TableCell>Não autorizado</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="outline">404</Badge>
                </TableCell>
                <TableCell>Recurso não encontrado</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="outline">429</Badge>
                </TableCell>
                <TableCell>Limite de taxa excedido</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="outline">500</Badge>
                </TableCell>
                <TableCell>Erro interno do servidor</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
