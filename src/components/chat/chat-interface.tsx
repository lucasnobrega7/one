"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Paperclip, Bot, User, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
}

interface Source {
  id: string
  content: string
  metadata: {
    source: string
    page?: number
    score: number
  }
}

interface ChatInterfaceProps {
  agentId: string
  agentName: string
  agentIconUrl?: string
  initialMessages?: Message[]
  conversationId?: string
}

export function ChatInterface({
  agentId,
  agentName,
  agentIconUrl,
  initialMessages = [],
  conversationId,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId)
  const [sources, setSources] = useState<Source[]>([])
  const [showSources, setShowSources] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agents/${agentId}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          conversation_id: currentConversationId,
          streaming: false,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from agent")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (data.sources && data.sources.length > 0) {
        setSources(data.sources)
      }

      if (data.conversation_id && !currentConversationId) {
        setCurrentConversationId(data.conversation_id)
        // Update URL without refreshing the page
        window.history.pushState({}, "", `/agents/${agentId}/chat?conversation=${data.conversation_id}`)
      }
    } catch (error) {
      console.error("Error querying agent:", error)

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "system",
        content: "Sorry, there was an error processing your request. Please try again.",
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)

      // Focus the textarea
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }

  // Handle textarea key press (Enter to submit, Shift+Enter for new line)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)]">
      <Card className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 border-b">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={agentIconUrl || "/placeholder.svg"} alt={agentName} />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{agentName}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
                <Bot className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Start a conversation with {agentName}</p>
                <p className="text-sm">Ask a question or describe what you need help with.</p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                        {message.role === "user" ? (
                          <>
                            <AvatarImage src="/placeholder-user.png" alt="User" />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : message.role === "assistant" ? (
                          <>
                            <AvatarImage src={agentIconUrl || "/placeholder.svg"} alt={agentName} />
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <AvatarFallback>S</AvatarFallback>
                        )}
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.role === "assistant"
                              ? "bg-muted"
                              : "bg-destructive text-destructive-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>

                        {message.role === "assistant" && sources.length > 0 && (
                          <div className="mt-2">
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-xs"
                              onClick={() => setShowSources(!showSources)}
                            >
                              {showSources ? "Hide sources" : "Show sources"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {showSources && sources.length > 0 && (
                  <div className="border rounded-lg p-3 mt-2">
                    <h4 className="font-medium mb-2">Sources</h4>
                    <div className="space-y-2">
                      {sources.map((source) => (
                        <div key={source.id} className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{source.metadata.source}</Badge>
                            {source.metadata.page && <Badge variant="outline">Page {source.metadata.page}</Badge>}
                            <Badge variant="outline">Score: {Math.round(source.metadata.score * 100)}%</Badge>
                          </div>
                          <p className="text-muted-foreground">{source.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex flex-row">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={agentIconUrl || "/placeholder.svg"} alt={agentName} />
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="rounded-lg p-3 bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex w-full items-end gap-2">
            <Button type="button" size="icon" variant="outline" className="shrink-0" disabled={isLoading}>
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Textarea
              ref={textareaRef}
              placeholder={`Message ${agentName}...`}
              className="min-h-10 flex-1 resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              rows={1}
            />

            <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
