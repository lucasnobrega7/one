"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Agent } from "./types/agent"
import { agentService } from "./services/agent-service"
import { queryService } from "@/conversations/services/query-service"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/hooks/use-current-user"
import type { Message } from "@/conversations/types/message"
import { SendIcon, RefreshCwIcon } from "lucide-react"

export default function AgentChatPage() {
  const params = useParams()
  const { toast } = useToast()
  const { user } = useCurrentUser()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const agentId = params?.id as string

  useEffect(() => {
    const fetchAgent = async () => {
      if (!agentId) return

      setIsLoading(true)
      try {
        const data = await agentService.getAgentById(agentId)
        if (!data) {
          toast({
            title: "Error",
            description: "Agent not found",
            variant: "destructive",
          })
          return
        }

        setAgent(data)

        // Add system message
        setMessages([
          {
            id: "system-welcome",
            role: "system",
            content: `Welcome! You are now chatting with ${data.name}. How can I help you today?`,
            createdAt: new Date(),
          },
        ])
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch agent",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgent()
  }, [agentId, toast])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || !agent || !user) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      const response = await queryService.queryAgent({
        agentId: agent.id,
        query: input,
        userId: user.id,
        conversationId: conversationId || undefined,
      })

      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId)
      }

      const assistantMessage: Message = {
        id: response.messageId || `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        createdAt: new Date(),
        sources: response.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      })

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "system",
          content: "Sorry, there was an error processing your request. Please try again.",
          createdAt: new Date(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: "system-welcome",
        role: "system",
        content: `Welcome! You are now chatting with ${agent?.name}. How can I help you today?`,
        createdAt: new Date(),
      },
    ])
    setConversationId(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!agent) {
    return null
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="h-[calc(100vh-8rem)] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              {agent.iconUrl && (
                <img src={agent.iconUrl || "/placeholder.svg"} alt={agent.name} className="w-8 h-8 rounded-full mr-2" />
              )}
              {agent.name}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isProcessing}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "system"
                      ? "bg-muted text-muted-foreground"
                      : "bg-secondary text-secondary-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                    <div className="font-semibold">Sources:</div>
                    <ul className="list-disc list-inside">
                      {message.sources.map((source, index) => (
                        <li key={index}>{source.title || source.url}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!input.trim() || isProcessing}>
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
