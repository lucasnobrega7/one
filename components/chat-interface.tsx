"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Send, Database } from "lucide-react"
import { KnowledgeUploader } from "./knowledge-uploader"
import { ApiStatus } from "./api-status"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou seu assistente de IA. Como posso ajudar você hoje?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Erro ao obter resposta")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Não foi possível gerar uma resposta. Por favor, tente novamente.",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      toast({
        title: "Erro na comunicação",
        description: error.message || "Ocorreu um erro ao processar sua mensagem",
        variant: "destructive",
      })

      const errorMessage: Message = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
        <TabsTrigger value="status">Status das APIs</TabsTrigger>
      </TabsList>

      <TabsContent value="chat">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Assistente IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-h-[500px] overflow-y-auto p-4 rounded-md bg-muted">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/abstract-ai-network.png" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/abstract-ai-network.png" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || input.trim() === ""}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="knowledge">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Base de Conhecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KnowledgeUploader />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="status">
        <Card>
          <CardHeader>
            <CardTitle>Status das APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <ApiStatus />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
