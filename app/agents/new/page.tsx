"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewAgentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(false)
  const [temperature, setTemperature] = useState(0.7)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          temperature: temperature,
          useKnowledgeBase,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar agente")
      }

      const result = await response.json()

      router.push(`/agents/${result.id}`)
    } catch (error) {
      console.error("Erro ao criar agente:", error)
      // Implementar notificação de erro
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container py-4">
          <div className="flex items-center">
            <Link href="/agents" className="flex items-center text-gray-600 hover:text-openai-teal">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm">Voltar para Agentes</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-10 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-2">Criar Novo Agente</h1>
          <p className="text-gray-600">Configure um agente conversacional personalizado para suas necessidades</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-medium border-b border-gray-100 pb-4">Informações Básicas</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Nome do Agente
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Assistente de Vendas"
                  required
                  className="border-gray-200 focus-visible:ring-openai-teal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva o propósito deste agente"
                  rows={3}
                  className="border-gray-200 focus-visible:ring-openai-teal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt" className="text-gray-700">
                  Prompt do Sistema
                </Label>
                <Textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  placeholder="Instruções para definir o comportamento do agente"
                  rows={5}
                  className="border-gray-200 focus-visible:ring-openai-teal"
                />
                <p className="text-xs text-gray-500">
                  Estas instruções definem como o agente deve se comportar e responder às perguntas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-medium border-b border-gray-100 pb-4">Configurações do Modelo</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modelId" className="text-gray-700">
                  Modelo
                </Label>
                <Select name="modelId" defaultValue="gpt-4o">
                  <SelectTrigger className="border-gray-200 focus:ring-openai-teal">
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="text-davinci-003">Davinci</SelectItem>
                    <SelectItem value="text-curie-001">Curie</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Modelos mais avançados oferecem melhor qualidade, mas podem ter custo mais elevado.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature" className="text-gray-700">
                    Temperatura
                  </Label>
                  <span className="text-sm text-gray-600">{temperature.toFixed(1)}</span>
                </div>
                <Slider
                  id="temperature"
                  name="temperature"
                  value={[temperature]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mais preciso</span>
                  <span>Mais criativo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-medium border-b border-gray-100 pb-4">Base de Conhecimento</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="useKnowledgeBase"
                  checked={useKnowledgeBase}
                  onCheckedChange={setUseKnowledgeBase}
                  className="data-[state=checked]:bg-openai-teal"
                />
                <Label htmlFor="useKnowledgeBase" className="text-gray-700">
                  Usar base de conhecimento
                </Label>
              </div>
              <p className="text-sm text-gray-600">
                Bases de conhecimento permitem que seu agente responda com base em documentos e dados específicos.
              </p>

              {useKnowledgeBase && (
                <Tabs defaultValue="existing" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                    <TabsTrigger
                      value="existing"
                      className="data-[state=active]:bg-white data-[state=active]:text-openai-teal"
                    >
                      Base Existente
                    </TabsTrigger>
                    <TabsTrigger
                      value="new"
                      className="data-[state=active]:bg-white data-[state=active]:text-openai-teal"
                    >
                      Nova Base
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="existing" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="knowledgeBaseId" className="text-gray-700">
                        Selecionar Base
                      </Label>
                      <Select name="knowledgeBaseId">
                        <SelectTrigger className="border-gray-200 focus:ring-openai-teal">
                          <SelectValue placeholder="Selecione uma base de conhecimento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kb1">Documentação de Produtos</SelectItem>
                          <SelectItem value="kb2">FAQ de Suporte</SelectItem>
                          <SelectItem value="kb3">Políticas da Empresa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="new" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="newKbName" className="text-gray-700">
                        Nome da Base
                      </Label>
                      <Input
                        id="newKbName"
                        name="newKbName"
                        placeholder="Ex: Base de Produtos"
                        className="border-gray-200 focus-visible:ring-openai-teal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newKbDescription" className="text-gray-700">
                        Descrição
                      </Label>
                      <Textarea
                        id="newKbDescription"
                        name="newKbDescription"
                        placeholder="Descreva o conteúdo desta base de conhecimento"
                        rows={2}
                        className="border-gray-200 focus-visible:ring-openai-teal"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              className="border-gray-200 text-gray-700 hover:text-openai-teal hover:border-openai-teal"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-openai-teal hover:bg-openai-teal2 text-white">
              {loading ? "Criando..." : "Criar Agente"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
