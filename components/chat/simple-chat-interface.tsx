'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/unified/api-client'
import { useApiCall } from '@/hooks/use-api-call'
import { toast } from 'sonner'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  agentId?: string
}

interface SimpleChatInterfaceProps {
  agentId: string
  agentName?: string
  placeholder?: string
}

export function SimpleChatInterface({ 
  agentId, 
  agentName = 'Agente IA',
  placeholder = 'Digite sua mensagem...'
}: SimpleChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Olá! Eu sou o ${agentName}. Como posso ajudá-lo hoje?`,
      role: 'assistant',
      timestamp: new Date(),
      agentId
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const { loading, execute } = useApiCall<{ message: string }>()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')

    try {

        const response = await apiClient.sendMessage(currentInput, agentId)
        
        if (response.success && response.data) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.data.message || 'Desculpe, não consegui processar sua mensagem.',
            role: 'assistant',
            timestamp: new Date(),
            agentId
          }
          
          setMessages(prev => [...prev, assistantMessage])
        } else {
          // Fallback response for demo
          const fallbackMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Obrigado pela sua mensagem: "${currentInput}". Esta é uma resposta de demonstração do ${agentName}.`,
            role: 'assistant',
            timestamp: new Date(),
            agentId
          }
          
          setMessages(prev => [...prev, fallbackMessage])
        }
    } catch (error) {
      toast.error('Erro ao enviar mensagem')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{agentName}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className={`text-xs opacity-70 mt-1 block ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {agentName} está digitando...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!inputValue.trim() || loading}
              size="icon"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </CardContent>
    </Card>
  )
}