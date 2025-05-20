"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Message } from "../types/conversation.types"

interface ChatInterfaceProps {
  agentId: string
  agentName: string
  agentIconUrl?: string
  messages: Message[]
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>
  isLoading?: boolean
  placeholder?: string
}

export function ChatInterface({
  agentId,
  agentName,
  agentIconUrl,
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Digite sua mensagem...",
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" && attachments.length === 0) return
    if (isSending) return

    try {
      setIsSending(true)
      await onSendMessage(inputValue, attachments.length > 0 ? attachments : undefined)
      setInputValue("")
      setAttachments([])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split("\n").map((line, i) => <p key={i}>{line}</p>)
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={agentIconUrl || "/placeholder.svg"} alt={agentName} />
            <AvatarFallback>{agentName.charAt(0)}</AvatarFallback>
          </Avatar>
          {agentName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Inicie uma conversa com {agentName}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", {
                      "justify-end": message.role === "user",
                      "justify-start": message.role !== "user",
                    })}
                  >
                    <div
                      className={cn("max-w-[80%] rounded-lg p-3", {
                        "bg-primary text-primary-foreground": message.role === "user",
                        "bg-muted": message.role !== "user",
                      })}
                    >
                      {renderMessageContent(message.content)}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="text-xs flex items-center">
                              <Paperclip className="h-3 w-3 mr-1" />
                              <span>{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div
                        className={cn("text-xs mt-1", {
                          "text-primary-foreground/70": message.role === "user",
                          "text-muted-foreground": message.role !== "user",
                        })}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>{agentName} está digitando...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <div className="border-t p-4">
            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="bg-muted rounded px-2 py-1 text-xs flex items-center">
                    <Paperclip className="h-3 w-3 mr-1" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="min-h-[60px] flex-1"
                disabled={isSending}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleAttachmentClick}
                  disabled={isSending}
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Anexar arquivo</span>
                </Button>
                <Button type="button" size="icon" onClick={handleSendMessage} disabled={isSending}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="sr-only">Enviar mensagem</span>
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
