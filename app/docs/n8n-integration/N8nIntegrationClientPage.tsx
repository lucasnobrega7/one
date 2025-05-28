"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info } from "lucide-react"

export default function N8nIntegrationClientPage() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-white/70">
        A integração com o N8N permite que você automatize fluxos de trabalho envolvendo a plataforma Agentes de
        Conversão.
      </p>

      <Alert className="bg-[#1a1a1d] border-[#27272a]">
        <Info className="h-4 w-4 text-[#46B2E0]" />
        <AlertTitle className="text-white/90">Dica</AlertTitle>
        <AlertDescription className="text-white/70">
          O N8N é uma ferramenta de automação de fluxo de trabalho que permite conectar diferentes aplicativos e
          serviços. Saiba mais em {"https://n8n.io"}.
        </AlertDescription>
      </Alert>

      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Configuração Inicial</CardTitle>
          <CardDescription className="text-white/70">Como configurar a integração com o N8N</CardDescription>
        </CardHeader>
        <CardContent>
          <h4 className="mb-2 font-medium text-white/90">Pré-requisitos</h4>
          <ul className="list-disc pl-5 mb-4 text-white/70">
            <li className="mb-1">Uma instância do N8N em execução</li>
            <li className="mb-1">Uma conta na plataforma Agentes de Conversão</li>
            <li>Chave de API dos Agentes de Conversão</li>
          </ul>

          <h4 className="mb-2 font-medium text-white/90">Passos para Configuração</h4>
          <ol className="list-decimal pl-5 text-white/70">
            <li className="mb-1">Acesse sua instância do N8N</li>
            <li className="mb-1">Crie um novo fluxo de trabalho</li>
            <li className="mb-1">Adicione um nó HTTP Request ou use nosso nó personalizado (veja abaixo)</li>
            <li className="mb-1">Configure a autenticação usando sua chave de API</li>
            <li>Conecte com outros nós para criar seu fluxo de trabalho</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Nó Personalizado</CardTitle>
          <CardDescription className="text-white/70">Como instalar e usar o nó personalizado dos Agentes de Conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-white/70">
            Oferecemos um nó personalizado para o N8N que facilita a integração com nossa plataforma. Este nó fornece
            uma interface amigável para todas as operações da API.
          </p>

          <h4 className="mb-2 font-medium text-white/90">Instalação</h4>
          <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm mb-4">{`npm install n8n-nodes-agentes-conversao`}</pre>

          <h4 className="mb-2 mt-4 font-medium text-white/90">Recursos do Nó</h4>
          <ul className="list-disc pl-5 text-white/70">
            <li className="mb-1">Operações para gerenciar agentes</li>
            <li className="mb-1">Operações para gerenciar conversas</li>
            <li className="mb-1">Operações para gerenciar bases de conhecimento</li>
            <li className="mb-1">Gatilhos para eventos via webhook</li>
            <li>Suporte para autenticação simplificada</li>
          </ul>
        </CardContent>
      </Card>

      <Tabs defaultValue="agents">
        <TabsList className="bg-[#1a1a1d] border-[#27272a]">
          <TabsTrigger value="agents" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Fluxos de Agentes</TabsTrigger>
          <TabsTrigger value="conversations" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Fluxos de Conversas</TabsTrigger>
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-white/70">Fluxos de Conhecimento</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4 pt-4">
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white/90">Exemplo: Criar Agente Automaticamente</CardTitle>
              <CardDescription className="text-white/70">Fluxo para criar um novo agente quando um formulário é preenchido</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white/70">
                Este exemplo mostra como criar um novo agente automaticamente quando um formulário é preenchido em seu
                site.
              </p>

              <h4 className="mb-2 font-medium text-white/90">Configuração do Fluxo</h4>
              <ol className="list-decimal pl-5 text-white/70 mb-4">
                <li className="mb-1">Adicione um nó de gatilho Webhook para receber dados do formulário</li>
                <li className="mb-1">Adicione um nó Agentes de Conversão</li>
                <li className="mb-1">Selecione a operação &quot;Criar Agente&quot;</li>
                <li className="mb-1">Mapeie os campos do formulário para os campos do agente</li>
                <li>Adicione um nó de notificação por e-mail para confirmar a criação</li>
              </ol>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Código JSON do Fluxo</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#46B2E0] text-sm overflow-x-auto">
                {`{
  "nodes": [
    {
      "id": "1",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "path": "create-agent",
        "responseMode": "onReceived"
      }
    },
    {
      "id": "2",
      "type": "n8n-nodes-agentes-conversao.agent",
      "position": [500, 300],
      "parameters": {
        "operation": "create",
        "name": "={{$node[\\"1\\"].json[\\"agent_name\\"]}}",
        "description": "={{$node[\\"1\\"].json[\\"agent_description\\"]}}",
        "knowledge_base_ids": "={{$node[\\"1\\"].json[\\"knowledge_base_ids\\"]}}"
      }
    },
    {
      "id": "3",
      "type": "n8n-nodes-base.emailSend",
      "position": [750, 300],
      "parameters": {
        "to": "={{$node[\\"1\\"].json[\\"email\\"]}}",
        "subject": "Agente Criado com Sucesso",
        "text": "Seu agente {{$node[\\"2\\"].json[\\"name\\"]}} foi criado com sucesso!"
      }
    }
  ],
  "connections": {
    "1": {
      "main": [
        [
          {
            "node": "2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "2": {
      "main": [
        [
          {
            "node": "3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4 pt-4">
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white/90">Exemplo: Notificação de Novas Conversas</CardTitle>
              <CardDescription className="text-white/70">Fluxo para notificar sobre novas conversas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white/70">
                Este exemplo mostra como enviar notificações para o Slack quando uma nova conversa é iniciada.
              </p>

              <h4 className="mb-2 font-medium text-white/90">Configuração do Fluxo</h4>
              <ol className="list-decimal pl-5 text-white/70 mb-4">
                <li className="mb-1">Adicione um nó de gatilho Webhook para receber eventos de webhook</li>
                <li className="mb-1">Adicione um nó If para filtrar apenas eventos de conversa.created</li>
                <li className="mb-1">Adicione um nó Agentes de Conversão para obter detalhes da conversa</li>
                <li className="mb-1">Adicione um nó Slack para enviar a notificação</li>
                <li>Configure a mensagem do Slack com os detalhes da conversa</li>
              </ol>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Código JSON do Fluxo</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#8A53D2] text-sm overflow-x-auto">
                {`{
  "nodes": [
    {
      "id": "1",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "path": "webhook-receiver",
        "responseMode": "onReceived"
      }
    },
    {
      "id": "2",
      "type": "n8n-nodes-base.if",
      "position": [500, 300],
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$node[\\"1\\"].json[\\"event\\"]}}",
              "operation": "equals",
              "value2": "conversation.created"
            }
          ]
        }
      }
    },
    {
      "id": "3",
      "type": "n8n-nodes-agentes-conversao.conversation",
      "position": [750, 300],
      "parameters": {
        "operation": "get",
        "id": "={{$node[\\"1\\"].json[\\"data\\"][\\"id\\"]}}"
      }
    },
    {
      "id": "4",
      "type": "n8n-nodes-base.slack",
      "position": [1000, 300],
      "parameters": {
        "channel": "#notifications",
        "text": "Nova conversa iniciada!\\nID: {{$node[\\"3\\"].json[\\"id\\"]}}\\nAgente: {{$node[\\"3\\"].json[\\"agent_name\\"]}}\\nUsuário: {{$node[\\"3\\"].json[\\"user_name\\"]}}"
      }
    }
  ],
  "connections": {
    "1": {
      "main": [
        [
          {
            "node": "2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "2": {
      "main": [
        [
          {
            "node": "3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "3": {
      "main": [
        [
          {
            "node": "4",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4 pt-4">
          <Card className="bg-[#1a1a1d] border-[#27272a]">
            <CardHeader>
              <CardTitle className="text-white/90">Exemplo: Atualização Automática de Base de Conhecimento</CardTitle>
              <CardDescription className="text-white/70">
                Fluxo para atualizar a base de conhecimento quando um documento é modificado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white/70">
                Este exemplo mostra como atualizar automaticamente a base de conhecimento quando um documento é
                modificado no Google Drive.
              </p>

              <h4 className="mb-2 font-medium text-white/90">Configuração do Fluxo</h4>
              <ol className="list-decimal pl-5 text-white/70 mb-4">
                <li className="mb-1">Adicione um nó de gatilho Google Drive para monitorar alterações em documentos</li>
                <li className="mb-1">Adicione um nó Google Drive para baixar o documento atualizado</li>
                <li className="mb-1">Adicione um nó Agentes de Conversão</li>
                <li className="mb-1">Selecione a operação &quot;Atualizar Base de Conhecimento&quot;</li>
                <li>Configure para enviar o documento baixado para a base de conhecimento</li>
              </ol>

              <h4 className="mb-2 mt-4 font-medium text-white/90">Código JSON do Fluxo</h4>
              <pre className="rounded bg-[#0e0e10] border border-[#27272a] p-4 text-[#E056A0] text-sm overflow-x-auto">
                {`{
  "nodes": [
    {
      "id": "1",
      "type": "n8n-nodes-base.googleDriveTrigger",
      "position": [250, 300],
      "parameters": {
        "folderId": "your_folder_id",
        "options": {
          "watchForChanges": true
        }
      }
    },
    {
      "id": "2",
      "type": "n8n-nodes-base.googleDrive",
      "position": [500, 300],
      "parameters": {
        "operation": "download",
        "fileId": "={{$node[\\"1\\"].json[\\"fileId\\"]}}"
      }
    },
    {
      "id": "3",
      "type": "n8n-nodes-agentes-conversao.knowledge",
      "position": [750, 300],
      "parameters": {
        "operation": "updateDocument",
        "knowledgeBaseId": "your_knowledge_base_id",
        "documentId": "={{$node[\\"1\\"].json[\\"name\\"]}}",
        "binaryPropertyName": "data",
        "additionalFields": {
          "title": "={{$node[\\"1\\"].json[\\"name\\"]}}",
          "description": "Documento atualizado automaticamente via N8N"
        }
      }
    }
  ],
  "connections": {
    "1": {
      "main": [
        [
          {
            "node": "2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "2": {
      "main": [
        [
          {
            "node": "3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Melhores Práticas</CardTitle>
          <CardDescription className="text-white/70">Recomendações para integração eficiente com o N8N</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-white/70">
            <li className="mb-2">
              <strong className="text-white/90">Use webhooks para eventos em tempo real</strong> - Configure webhooks para receber notificações de
              eventos em tempo real, em vez de fazer polling periódico.
            </li>
            <li className="mb-2">
              <strong className="text-white/90">Implemente tratamento de erros</strong> - Adicione nós de tratamento de erros para lidar com
              falhas na API ou problemas de conexão.
            </li>
            <li className="mb-2">
              <strong className="text-white/90">Armazene credenciais com segurança</strong> - Use o gerenciador de credenciais do N8N para
              armazenar sua chave de API com segurança.
            </li>
            <li className="mb-2">
              <strong className="text-white/90">Teste seus fluxos</strong> - Use o modo de teste do N8N para verificar se seus fluxos estão
              funcionando corretamente antes de ativá-los.
            </li>
            <li className="mb-2">
              <strong className="text-white/90">Monitore o uso da API</strong> - Fique atento aos limites de taxa da API para evitar problemas de
              throttling.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1d] border-[#27272a]">
        <CardHeader>
          <CardTitle className="text-white/90">Solução de Problemas</CardTitle>
          <CardDescription className="text-white/70">Problemas comuns e suas soluções</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272a]">
                  <TableHead className="text-white/90">Problema</TableHead>
                  <TableHead className="text-white/90">Possível Causa</TableHead>
                  <TableHead className="text-white/90">Solução</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-white/70">Erro de Autenticação</TableCell>
                  <TableCell className="text-white/70">Chave de API inválida ou expirada</TableCell>
                  <TableCell className="text-white/70">Verifique e atualize sua chave de API nas credenciais do N8N</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-white/70">Webhook não recebe eventos</TableCell>
                  <TableCell className="text-white/70">URL do webhook incorreta ou não registrada</TableCell>
                  <TableCell className="text-white/70">Verifique se a URL do webhook está corretamente configurada na plataforma</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-white/70">Erro 429 (Too Many Requests)</TableCell>
                  <TableCell className="text-white/70">Limite de taxa excedido</TableCell>
                  <TableCell className="text-white/70">Adicione atrasos entre as requisições ou reduza a frequência de execução do fluxo</TableCell>
                </TableRow>
                <TableRow className="border-[#27272a]">
                  <TableCell className="text-white/70">Dados incorretos ou ausentes</TableCell>
                  <TableCell className="text-white/70">Mapeamento de dados incorreto</TableCell>
                  <TableCell className="text-white/70">Verifique o mapeamento de dados entre os nós e use o depurador do N8N</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}