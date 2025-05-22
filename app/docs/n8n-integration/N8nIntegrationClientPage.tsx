"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info } from "lucide-react"

export default function N8nIntegrationClientPage() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-700">
        A integração com o N8N permite que você automatize fluxos de trabalho envolvendo a plataforma Agentes de
        Conversão.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Dica</AlertTitle>
        <AlertDescription>
          O N8N é uma ferramenta de automação de fluxo de trabalho que permite conectar diferentes aplicativos e
          serviços. Saiba mais em {"https://n8n.io"}.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Configuração Inicial</CardTitle>
          <CardDescription>Como configurar a integração com o N8N</CardDescription>
        </CardHeader>
        <CardContent>
          <h4 className="mb-2 font-medium">Pré-requisitos</h4>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-1">Uma instância do N8N em execução</li>
            <li className="mb-1">Uma conta na plataforma Agentes de Conversão</li>
            <li>Chave de API dos Agentes de Conversão</li>
          </ul>

          <h4 className="mb-2 font-medium">Passos para Configuração</h4>
          <ol className="list-decimal pl-5">
            <li className="mb-1">Acesse sua instância do N8N</li>
            <li className="mb-1">Crie um novo fluxo de trabalho</li>
            <li className="mb-1">Adicione um nó HTTP Request ou use nosso nó personalizado (veja abaixo)</li>
            <li className="mb-1">Configure a autenticação usando sua chave de API</li>
            <li>Conecte com outros nós para criar seu fluxo de trabalho</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nó Personalizado</CardTitle>
          <CardDescription>Como instalar e usar o nó personalizado dos Agentes de Conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Oferecemos um nó personalizado para o N8N que facilita a integração com nossa plataforma. Este nó fornece
            uma interface amigável para todas as operações da API.
          </p>

          <h4 className="mb-2 font-medium">Instalação</h4>
          <pre className="rounded bg-gray-100 p-4">{`npm install n8n-nodes-agentes-conversao`}</pre>

          <h4 className="mb-2 mt-4 font-medium">Recursos do Nó</h4>
          <ul className="list-disc pl-5">
            <li className="mb-1">Operações para gerenciar agentes</li>
            <li className="mb-1">Operações para gerenciar conversas</li>
            <li className="mb-1">Operações para gerenciar bases de conhecimento</li>
            <li className="mb-1">Gatilhos para eventos via webhook</li>
            <li>Suporte para autenticação simplificada</li>
          </ul>
        </CardContent>
      </Card>

      <Tabs defaultValue="agents">
        <TabsList>
          <TabsTrigger value="agents">Fluxos de Agentes</TabsTrigger>
          <TabsTrigger value="conversations">Fluxos de Conversas</TabsTrigger>
          <TabsTrigger value="knowledge">Fluxos de Conhecimento</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exemplo: Criar Agente Automaticamente</CardTitle>
              <CardDescription>Fluxo para criar um novo agente quando um formulário é preenchido</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Este exemplo mostra como criar um novo agente automaticamente quando um formulário é preenchido em seu
                site.
              </p>

              <h4 className="mb-2 font-medium">Configuração do Fluxo</h4>
              <ol className="list-decimal pl-5">
                <li className="mb-1">Adicione um nó de gatilho Webhook para receber dados do formulário</li>
                <li className="mb-1">Adicione um nó Agentes de Conversão</li>
                <li className="mb-1">Selecione a operação "Criar Agente"</li>
                <li className="mb-1">Mapeie os campos do formulário para os campos do agente</li>
                <li>Adicione um nó de notificação por e-mail para confirmar a criação</li>
              </ol>

              <h4 className="mb-2 mt-4 font-medium">Código JSON do Fluxo</h4>
              <pre className="rounded bg-gray-100 p-4">
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
        "name": "={{$node[\"1\"].json[\"agent_name\"]}}",
        "description": "={{$node[\"1\"].json[\"agent_description\"]}}",
        "knowledge_base_ids": "={{$node[\"1\"].json[\"knowledge_base_ids\"]}}"
      }
    },
    {
      "id": "3",
      "type": "n8n-nodes-base.emailSend",
      "position": [750, 300],
      "parameters": {
        "to": "={{$node[\"1\"].json[\"email\"]}}",
        "subject": "Agente Criado com Sucesso",
        "text": "Seu agente {{$node[\"2\"].json[\"name\"]}} foi criado com sucesso!"
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
          <Card>
            <CardHeader>
              <CardTitle>Exemplo: Notificação de Novas Conversas</CardTitle>
              <CardDescription>Fluxo para notificar sobre novas conversas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Este exemplo mostra como enviar notificações para o Slack quando uma nova conversa é iniciada.
              </p>

              <h4 className="mb-2 font-medium">Configuração do Fluxo</h4>
              <ol className="list-decimal pl-5">
                <li className="mb-1">Adicione um nó de gatilho Webhook para receber eventos de webhook</li>
                <li className="mb-1">Adicione um nó If para filtrar apenas eventos de conversa.created</li>
                <li className="mb-1">Adicione um nó Agentes de Conversão para obter detalhes da conversa</li>
                <li className="mb-1">Adicione um nó Slack para enviar a notificação</li>
                <li>Configure a mensagem do Slack com os detalhes da conversa</li>
              </ol>

              <h4 className="mb-2 mt-4 font-medium">Código JSON do Fluxo</h4>
              <pre className="rounded bg-gray-100 p-4">
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
              "value1": "={{$node[\"1\"].json[\"event\"]}}",
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
        "id": "={{$node[\"1\"].json[\"data\"][\"id\"]}}"
      }
    },
    {
      "id": "4",
      "type": "n8n-nodes-base.slack",
      "position": [1000, 300],
      "parameters": {
        "channel": "#notifications",
        "text": "Nova conversa iniciada!\\nID: {{$node[\"3\"].json[\"id\"]}}\\nAgente: {{$node[\"3\"].json[\"agent_name\"]}}\\nUsuário: {{$node[\"3\"].json[\"user_name\"]}}"
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
          <Card>
            <CardHeader>
              <CardTitle>Exemplo: Atualização Automática de Base de Conhecimento</CardTitle>
              <CardDescription>
                Fluxo para atualizar a base de conhecimento quando um documento é modificado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Este exemplo mostra como atualizar automaticamente a base de conhecimento quando um documento é
                modificado no Google Drive.
              </p>

              <h4 className="mb-2 font-medium">Configuração do Fluxo</h4>
              <ol className="list-decimal pl-5">
                <li className="mb-1">Adicione um nó de gatilho Google Drive para monitorar alterações em documentos</li>
                <li className="mb-1">Adicione um nó Google Drive para baixar o documento atualizado</li>
                <li className="mb-1">Adicione um nó Agentes de Conversão</li>
                <li className="mb-1">Selecione a operação "Atualizar Base de Conhecimento"</li>
                <li>Configure para enviar o documento baixado para a base de conhecimento</li>
              </ol>

              <h4 className="mb-2 mt-4 font-medium">Código JSON do Fluxo</h4>
              <pre className="rounded bg-gray-100 p-4">
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
        "fileId": "={{$node[\"1\"].json[\"fileId\"]}}"
      }
    },
    {
      "id": "3",
      "type": "n8n-nodes-agentes-conversao.knowledge",
      "position": [750, 300],
      "parameters": {
        "operation": "updateDocument",
        "knowledgeBaseId": "your_knowledge_base_id",
        "documentId": "={{$node[\"1\"].json[\"name\"]}}",
        "binaryPropertyName": "data",
        "additionalFields": {
          "title": "={{$node[\"1\"].json[\"name\"]}}",
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

      <Card>
        <CardHeader>
          <CardTitle>Melhores Práticas</CardTitle>
          <CardDescription>Recomendações para integração eficiente com o N8N</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            <li className="mb-2">
              <strong>Use webhooks para eventos em tempo real</strong> - Configure webhooks para receber notificações de
              eventos em tempo real, em vez de fazer polling periódico.
            </li>
            <li className="mb-2">
              <strong>Implemente tratamento de erros</strong> - Adicione nós de tratamento de erros para lidar com
              falhas na API ou problemas de conexão.
            </li>
            <li className="mb-2">
              <strong>Armazene credenciais com segurança</strong> - Use o gerenciador de credenciais do N8N para
              armazenar sua chave de API com segurança.
            </li>
            <li className="mb-2">
              <strong>Teste seus fluxos</strong> - Use o modo de teste do N8N para verificar se seus fluxos estão
              funcionando corretamente antes de ativá-los.
            </li>
            <li className="mb-2">
              <strong>Monitore o uso da API</strong> - Fique atento aos limites de taxa da API para evitar problemas de
              throttling.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Solução de Problemas</CardTitle>
          <CardDescription>Problemas comuns e suas soluções</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problema</TableHead>
                <TableHead>Possível Causa</TableHead>
                <TableHead>Solução</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Erro de Autenticação</TableCell>
                <TableCell>Chave de API inválida ou expirada</TableCell>
                <TableCell>Verifique e atualize sua chave de API nas credenciais do N8N</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Webhook não recebe eventos</TableCell>
                <TableCell>URL do webhook incorreta ou não registrada</TableCell>
                <TableCell>Verifique se a URL do webhook está corretamente configurada na plataforma</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Erro 429 (Too Many Requests)</TableCell>
                <TableCell>Limite de taxa excedido</TableCell>
                <TableCell>Adicione atrasos entre as requisições ou reduza a frequência de execução do fluxo</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dados incorretos ou ausentes</TableCell>
                <TableCell>Mapeamento de dados incorreto</TableCell>
                <TableCell>Verifique o mapeamento de dados entre os nós e use o depurador do N8N</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
