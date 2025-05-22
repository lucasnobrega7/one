"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Bot, User, Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt: string
}

export default function AgentChatPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carregar histórico de conversa se houver conversationId
    if (conversationId) {
      fetchConversationHistory()
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversationHistory = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      const data = await response.json()

      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
          message: input,
          conversationId,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId)
      }

      if (data.message) {
        setMessages((prev) => [...prev, data.message])
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      // Adicionar mensagem de erro
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
          role: "assistant",
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="border-b border-white/20 py-4">
        <div className="container flex items-center">
          <Link href="/agents" className="text-sm underline hover:no-underline flex items-center mr-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black mr-2">
              <Bot className="h-4 w-4" />
            </div>
            <span>Assistente de Vendas</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6 flex flex-col max-w-3xl mx-auto">
        <div className="flex-1 space-y-6 overflow-y-auto pb-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-8 w-8" />
              </div>
              <h2 className="text-2xl mb-2">Como posso ajudar?</h2>
              <p className="text-white/70 max-w-md">
                Este assistente pode responder perguntas sobre produtos, qualificar leads e ajudar com o processo de
                vendas.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "assistant" ? "bg-white text-black" : "bg-white/10"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`px-4 py-2 ${message.role === "user" ? "bg-white text-black" : "bg-white/10"}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/20 pt-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={loading}
              className="flex-1 border-white/20 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-white"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="border border-white bg-white text-black hover:bg-white/90"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
