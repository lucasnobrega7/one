"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import useWebSocket from 'react-use-websocket'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  streaming?: boolean
}

export function StreamingChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    {
      onOpen: () => toast.success('Conectado ao chat'),
      onClose: () => toast.error('Conexão perdida'),
      shouldReconnect: () => true,
    }
  )

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data)
      
      if (data.type === 'message_chunk') {
        setMessages(prev => {
          const existing = prev.find(m => m.id === data.messageId)
          if (existing) {
            return prev.map(m => 
              m.id === data.messageId 
                ? { ...m, content: m.content + data.chunk }
                : m
            )
          } else {
            return [...prev, {
              id: data.messageId,
              role: 'assistant',
              content: data.chunk,
              timestamp: new Date(),
              streaming: true
            }]
          }
        })
      }
      
      if (data.type === 'message_complete') {
        setMessages(prev => prev.map(m => 
          m.id === data.messageId 
            ? { ...m, streaming: false }
            : m
        ))
        setIsTyping(false)
      }
    }
  }, [lastMessage])

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    sendMessage(JSON.stringify({
      type: 'user_message',
      content: input,
      messageId: userMessage.id
    }))
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <span className="font-medium">Agente de Conversão</span>
          <div className={`w-2 h-2 rounded-full ${
            readyState === 1 ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white ml-auto' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.streaming && (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-1 h-4 bg-blue-500 animate-pulse" />
                    <span className="text-xs opacity-75">Digitando...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500">
              <Bot className="h-4 w-4" />
              <span className="text-sm">Agente está digitando...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}