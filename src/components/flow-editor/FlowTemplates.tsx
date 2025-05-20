"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ITemplate } from "@/lib/interfaces/flow"

// Templates de exemplo
const TEMPLATES: ITemplate[] = [
  {
    id: "welcome",
    name: "Fluxo de Boas-vindas",
    description: "Um fluxo simples para dar boas-vindas aos usuários",
    category: "basic",
    nodes: [
      {
        id: "intentNode_1",
        type: "intentNode",
        position: { x: 250, y: 50 },
        data: {
          label: "Saudação Inicial",
          intents: ["olá", "oi", "bom dia", "boa tarde", "boa noite"],
        },
      },
      {
        id: "messageNode_1",
        type: "messageNode",
        position: { x: 250, y: 200 },
        data: {
          label: "Mensagem de Boas-vindas",
          message: "Olá! Sou um assistente virtual. Como posso ajudar você hoje?",
        },
      },
    ],
    edges: [
      {
        id: "edge_1",
        source: "intentNode_1",
        target: "messageNode_1",
        animated: true,
        style: { stroke: "#FF5722", strokeWidth: 2 },
      },
    ],
  },
  {
    id: "faq",
    name: "FAQ Básico",
    description: "Um fluxo para responder perguntas frequentes",
    category: "basic",
    nodes: [
      {
        id: "intentNode_1",
        type: "intentNode",
        position: { x: 250, y: 50 },
        data: {
          label: "Perguntas Frequentes",
          intents: ["o que é", "como funciona", "quanto custa", "onde encontro"],
        },
      },
      {
        id: "conditionNode_1",
        type: "conditionNode",
        position: { x: 250, y: 200 },
        data: {
          label: "Tipo de Pergunta",
          condition: "intent.includes('o que é')",
          branches: ["O que é", "Como funciona", "Preço", "Localização"],
        },
      },
      {
        id: "messageNode_1",
        type: "messageNode",
        position: { x: 100, y: 350 },
        data: {
          label: "Resposta - O que é",
          message: "Nosso produto é uma solução inovadora para...",
        },
      },
      {
        id: "messageNode_2",
        type: "messageNode",
        position: { x: 250, y: 350 },
        data: {
          label: "Resposta - Como funciona",
          message: "Nosso produto funciona através de...",
        },
      },
      {
        id: "messageNode_3",
        type: "messageNode",
        position: { x: 400, y: 350 },
        data: {
          label: "Resposta - Preço",
          message: "Nossos planos começam a partir de R$ 99,90 por mês...",
        },
      },
      {
        id: "messageNode_4",
        type: "messageNode",
        position: { x: 550, y: 350 },
        data: {
          label: "Resposta - Localização",
          message: "Você pode nos encontrar em...",
        },
      },
    ],
    edges: [
      {
        id: "edge_1",
        source: "intentNode_1",
        target: "conditionNode_1",
        animated: true,
        style: { stroke: "#FF5722", strokeWidth: 2 },
      },
      {
        id: "edge_2",
        source: "conditionNode_1",
        target: "messageNode_1",
        sourceHandle: "branch-0",
        animated: true,
        style: { stroke: "#FF5722", strokeWidth: 2 },
      },
      {
        id: "edge_3",
        source: "conditionNode_1",
        target: "messageNode_2",
        sourceHandle: "branch-1",
        animated: true,
        style: { stroke: "#FF5722", strokeWidth: 2 },
      },
      {
        id: "edge_4",
        source: "conditionNode_1",
        target: "messageNode_3",
        sourceHandle: "branch-2",
        animated: true,
        style: { stroke: "#FF5722", strokeWidth: 2 },
      },
      {
        id: "edge_5",
        source: "conditionNode_1",
        target: "messageNode_4",
        sourceHandle: "branch-3",
        animated: true,
        style: { stroke: "#FF5722", strokeWidth: 2 },
      },
    ],
  },
  {
    id: "support",
    name: "Atendimento ao Cliente",
    description: "Um fluxo para atendimento ao cliente com opções de suporte",
    category: "advanced",
    nodes: [
      // Nós para o fluxo de atendimento ao cliente
      // (simplificado para economizar espaço)
    ],
    edges: [
      // Arestas para o fluxo de atendimento ao cliente
    ],
  },
]

interface FlowTemplatesProps {
  onClose: () => void
  onSelectTemplate: (template: ITemplate) => void
}

export function FlowTemplates({ onClose, onSelectTemplate }: FlowTemplatesProps) {
  const [templates, setTemplates] = useState<ITemplate[]>([])
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    // Em uma implementação real, você buscaria os templates da API
    setTemplates(TEMPLATES)
  }, [])

  const filteredTemplates =
    activeCategory === "all" ? templates : templates.filter((template) => template.category === activeCategory)

  const categories = [
    { id: "all", name: "Todos" },
    { id: "basic", name: "Básicos" },
    { id: "advanced", name: "Avançados" },
  ]

  return (
    <Card className="fixed inset-0 z-50 m-auto w-[800px] h-[600px] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Templates de Fluxo</CardTitle>
          <CardDescription>Selecione um template para começar seu fluxo</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeCategory}>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="default" size="sm" className="w-full" onClick={() => onSelectTemplate(template)}>
                        Usar este template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
