"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Send, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { INode, IEdge } from "@/lib/interfaces/flow"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface FlowSimulatorProps {
  flow: {
    nodes: INode[]
    edges: IEdge[]
  }
  onClose: () => void
}

export function FlowSimulator({ flow, onClose }: FlowSimulatorProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Adicionar mensagem de boas-vindas ao iniciar
  useEffect(() => {
    // Encontrar o primeiro nó de mensagem
    const firstMessageNode = flow.nodes.find((node) => node.type === "messageNode")

    if (firstMessageNode) {
      setMessages([
        {
          id: "welcome",
          content: firstMessageNode.data.message || "Olá! Como posso ajudar?",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } else {
      setMessages([
        {
          id: "welcome",
          content: "Bem-vindo ao simulador de fluxo. Digite uma mensagem para começar.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }
  }, [flow.nodes])

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simular processamento do fluxo
    try {
      // Encontrar nós de intenção que correspondam à entrada do usuário
      const intentNodes = flow.nodes.filter(
        (node) =>
          node.type === "intentNode" &&
          node.data.intents?.some((intent: string) => input.toLowerCase().includes(intent.toLowerCase())),
      )

      // Se encontrou uma intenção, seguir o fluxo
      if (intentNodes.length > 0) {
        const intentNode = intentNodes[0]

        // Encontrar a próxima conexão a partir deste nó
        const nextEdge = flow.edges.find((edge) => edge.source === intentNode.id)

        if (nextEdge) {
          // Encontrar o próximo nó
          const nextNode = flow.nodes.find((node) => node.id === nextEdge.target)

          if (nextNode) {
            // Se for um nó de mensagem, mostrar a mensagem
            if (nextNode.type === "messageNode") {
              setTimeout(() => {
                const botMessage: Message = {
                  id: `bot-${Date.now()}`,
                  content: nextNode.data.message || "Desculpe, não entendi.",
                  sender: "bot",
                  timestamp: new Date(),
                }
                setMessages((prev) => [...prev, botMessage])
                setIsProcessing(false)
              }, 1000)
              return
            }

            // Se for um nó de condição, avaliar a condição
            if (nextNode.type === "conditionNode") {
              // Simulação simplificada de avaliação de condição
              const conditionIndex = 0 // Em uma implementação real, você avaliaria a condição

              // Encontrar a próxima conexão com base na condição
              const conditionEdge = flow.edges.find(
                (edge) => edge.source === nextNode.id && edge.sourceHandle === `branch-${conditionIndex}`,
              )

              if (conditionEdge) {
                const responseNode = flow.nodes.find((node) => node.id === conditionEdge.target)

                if (responseNode && responseNode.type === "messageNode") {
                  setTimeout(() => {
                    const botMessage: Message = {
                      id: `bot-${Date.now()}`,
                      content: responseNode.data.message || "Desculpe, não entendi.",
                      sender: "bot",
                      timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, botMessage])
                    setIsProcessing(false)
                  }, 1000)
                  return
                }
              }
            }
          }
        }
      }

      // Resposta padrão se não encontrar correspondência no fluxo
      setTimeout(() => {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          content: "Desculpe, não entendi o que você quis dizer. Pode reformular?",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsProcessing(false)
      }, 1000)
    } catch (error) {
      console.error("Erro ao processar mensagem:", error)

      setTimeout(() => {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          content: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsProcessing(false)
      }, 1000)
    }
  }

  const resetChat = () => {
    // Encontrar o primeiro nó de mensagem
    const firstMessageNode = flow.nodes.find((node) => node.type === "messageNode")

    setMessages([
      {
        id: "welcome",
        content: firstMessageNode?.data.message || "Olá! Como posso ajudar?",
        sender: "bot",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <Card className="fixed inset-0 z-50 m-auto w-[500px] h-[600px] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Simulador de Fluxo</CardTitle>
          <CardDescription>Teste seu fluxo de conversação</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={resetChat}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className={message.sender === "user" ? "bg-primary" : "bg-muted"}>
                    <AvatarFallback>{message.sender === "user" ? "U" : "B"}</AvatarFallback>
                    {message.sender === "bot" && <AvatarImage src="/futuristic-helper-robot.png" />}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            disabled={isProcessing}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isProcessing}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
