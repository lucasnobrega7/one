"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SetupAgentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Campos do formulário
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é um assistente útil e amigável que responde perguntas de forma clara e concisa.",
  )
  const [modelId, setModelId] = useState("gpt-4o")
  const [temperature, setTemperature] = useState(0.7)
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          systemPrompt,
          modelId,
          temperature,
          useKnowledgeBase,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar agente")
      }

      setSuccess(true)

      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        router.push(`/dashboard/agents/${data.id}`)
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro ao criar o agente. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="border-b border-white/10 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM14.5 21.5C14.5 22.881 13.381 24 12 24C10.619 24 9.5 22.881 9.5 21.5C9.5 20.119 10.619 19 12 19C13.381 19 14.5 20.119 14.5 21.5ZM14.5 10.5C14.5 11.881 13.381 13 12 13C10.619 13 9.5 11.881 9.5 10.5C9.5 9.119 10.619 8 12 8C13.381 8 14.5 9.119 14.5 10.5ZM20 16C20 17.381 18.881 18.5 17.5 18.5C16.119 18.5 15 17.381 15 16C15 14.619 16.119 13.5 17.5 13.5C18.881 13.5 20 14.619 20 16ZM22.5 21.5C22.5 22.881 21.381 24 20 24C18.619 24 17.5 22.881 17.5 21.5C17.5 20.119 18.619 19 20 19C21.381 19 22.5 20.119 22.5 21.5ZM22.5 10.5C22.5 11.881 21.381 13 20 13C18.619 13 17.5 11.881 17.5 10.5C17.5 9.119 18.619 8 20 8C21.381 8 22.5 9.119 22.5 10.5Z"
                fill="white"
              />
            </svg>
            <span className="font-medium">Agentes de Conversão</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-10 px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-2">Configure seu primeiro agente</h1>
          <p className="text-white/70">
            Personalize seu agente de IA conversacional para atender às suas necessidades.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-500/20 border-green-500/50">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription>Agente criado com sucesso! Redirecionando para o dashboard...</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-medium border-b border-white/10 pb-4">Informações Básicas</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nome do Agente
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Assistente de Vendas"
                  required
                  className="bg-transparent border-white/20 focus-visible:ring-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o propósito deste agente"
                  rows={3}
                  className="bg-transparent border-white/20 focus-visible:ring-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt" className="text-white">
                  Prompt do Sistema
                </Label>
                <Textarea
                  id="systemPrompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Instruções para definir o comportamento do agente"
                  rows={5}
                  className="bg-transparent border-white/20 focus-visible:ring-white"
                />
                <p className="text-xs text-white/50">
                  Estas instruções definem como o agente deve se comportar e responder às perguntas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-medium border-b border-white/10 pb-4">Configurações do Modelo</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modelId" className="text-white">
                  Modelo
                </Label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger className="bg-transparent border-white/20 focus:ring-white">
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="text-davinci-003">Davinci</SelectItem>
                    <SelectItem value="text-curie-001">Curie</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-white/50">
                  Modelos mais avançados oferecem melhor qualidade, mas podem ter custo mais elevado.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature" className="text-white">
                    Temperatura
                  </Label>
                  <span className="text-sm text-white/70">{temperature.toFixed(1)}</span>
                </div>
                <Slider
                  id="temperature"
                  value={[temperature]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>Mais preciso</span>
                  <span>Mais criativo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-medium border-b border-white/10 pb-4">Base de Conhecimento</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="useKnowledgeBase" checked={useKnowledgeBase} onCheckedChange={setUseKnowledgeBase} />
                <Label htmlFor="useKnowledgeBase" className="text-white">
                  Usar base de conhecimento
                </Label>
              </div>
              <p className="text-sm text-white/70">
                Bases de conhecimento permitem que seu agente responda com base em documentos e dados específicos.
                {useKnowledgeBase && " Você poderá configurar sua base de conhecimento após criar o agente."}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !name}
              className="bg-white text-black hover:bg-white/90 flex items-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Criar Agente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
