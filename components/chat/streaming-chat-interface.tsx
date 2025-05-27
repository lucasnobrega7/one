'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Mic,
  Square,
  Volume2
} from 'lucide-react'
import { useApiCall } from '@/hooks/use-api-call'
import { toast } from 'sonner'
import useWebSocket, { ReadyState } from 'react-use-websocket'

interface StreamingMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  agentId?: string
  isStreaming?: boolean
  tokens?: number
  model?: string
}

interface StreamingChatInterfaceProps {
  agentId: string
  agentName?: string
  placeholder?: string
  websocketUrl?: string
}

export function StreamingChatInterface({ 
  agentId, 
  agentName = 'Agente IA',
  placeholder = 'Digite sua mensagem...',
  websocketUrl = 'wss://api.agentesdeconversao.ai/ws'
}: StreamingChatInterfaceProps) {
  const [messages, setMessages] = useState<StreamingMessage[]>([
    {
      id: '1',
      content: `Olá! Eu sou o ${agentName}. Como posso ajudá-lo hoje?`,
      role: 'assistant',
      timestamp: new Date(),
      agentId,
      model: 'gpt-4'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // WebSocket connection for real-time streaming
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    websocketUrl,
    {
      onOpen: () => {
        toast.success('Conectado ao chat em tempo real')
      },
      onClose: () => {
        toast.error('Conexão perdida - tentando reconectar...')
      },
      onError: (error) => {
        toast.error('Erro na conexão WebSocket')
      },
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 5,
      reconnectInterval: 3000,
    }
  )

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data)
        
        if (data.type === 'stream_start') {
          setCurrentStreamingId(data.messageId)
          setIsTyping(true)
          
          // Add new message for streaming
          const newMessage: StreamingMessage = {
            id: data.messageId,
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            agentId,
            isStreaming: true,
            model: data.model
          }
          setMessages(prev => [...prev, newMessage])
          
        } else if (data.type === 'stream_chunk') {
          // Update streaming message content
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, content: msg.content + data.chunk }
              : msg
          ))
          
        } else if (data.type === 'stream_end') {
          // Finalize streaming message
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { 
                  ...msg, 
                  isStreaming: false, 
                  tokens: data.tokens,
                  timestamp: new Date()
                }
              : msg
          ))
          setCurrentStreamingId(null)
          setIsTyping(false)
          
        } else if (data.type === 'error') {
          toast.error(data.message || 'Erro no streaming')
          setIsTyping(false)
          setCurrentStreamingId(null)
        }
      } catch (error) {
        // Error parsing WebSocket message - ignore malformed messages
      }
    }
  }, [lastMessage, agentId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendChatMessage = useCallback(() => {
    if (!inputValue.trim() || isTyping || readyState !== ReadyState.OPEN) return

    const userMessage: StreamingMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    
    // Send message via WebSocket
    sendMessage(JSON.stringify({
      type: 'chat_message',
      agentId,
      message: inputValue.trim(),
      messageId: userMessage.id
    }))

    setInputValue('')
  }, [inputValue, isTyping, readyState, sendMessage, agentId])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Mensagem copiada!')
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getConnectionStatus = () => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return { label: 'Conectando...', color: 'yellow' }
      case ReadyState.OPEN:
        return { label: 'Online', color: 'green' }
      case ReadyState.CLOSING:
        return { label: 'Desconectando...', color: 'orange' }
      case ReadyState.CLOSED:
        return { label: 'Offline', color: 'red' }
      default:
        return { label: 'Desconhecido', color: 'gray' }
    }
  }

  const connectionStatus = getConnectionStatus()

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{agentName}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${connectionStatus.color}-500`} />
            <span className="text-sm text-gray-500">{connectionStatus.label}</span>
            {isTyping && (
              <Badge variant="secondary">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Digitando...
              </Badge>
            )}
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
                  className={`max-w-[70%] rounded-lg px-3 py-2 relative group ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm flex-1">
                      {message.content}
                      {message.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                      )}
                    </p>
                    
                    {message.role === 'assistant' && !message.isStreaming && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs opacity-70 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                    
                    {message.model && message.tokens && (
                      <span className="text-xs opacity-70">
                        {message.model} • {message.tokens} tokens
                      </span>
                    )}
                  </div>
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
              disabled={isTyping || readyState !== ReadyState.OPEN}
              className="flex-1"
            />
            
            <Button 
              variant="outline" 
              size="icon"
              disabled={isTyping}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={sendChatMessage}
              disabled={!inputValue.trim() || isTyping || readyState !== ReadyState.OPEN}
              size="icon"
            >
              {isTyping ? (
                <Square className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              Enter para enviar • Shift+Enter para nova linha
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Streaming: {readyState === ReadyState.OPEN ? 'Ativo' : 'Inativo'}</span>
              {isTyping && <span>• IA digitando...</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}