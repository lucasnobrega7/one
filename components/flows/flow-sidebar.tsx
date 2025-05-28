"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Bot,
  Database,
  Zap,
  MessageSquare,
  FileText,
  Globe,
  Mail,
  Clock,
  Share2,
  Settings
} from 'lucide-react'

interface NodeCategory {
  name: string
  icon: React.ReactNode
  nodes: NodeTemplate[]
}

interface NodeTemplate {
  id: string
  label: string
  description: string
  icon: string
  category: string
  type: string
}

const nodeCategories: NodeCategory[] = [
  {
    name: 'Chat Models',
    icon: <Bot className="w-4 h-4" />,
    nodes: [
      {
        id: 'openrouter-gpt4',
        label: 'OpenRouter GPT-4',
        description: '87% margem de lucro garantida',
        icon: '🤖',
        category: 'Chat Models',
        type: 'chatModel'
      },
      {
        id: 'openrouter-claude',
        label: 'OpenRouter Claude',
        description: 'Anthropic Claude via OpenRouter',
        icon: '🧠',
        category: 'Chat Models',
        type: 'chatModel'
      },
      {
        id: 'openrouter-mixtral',
        label: 'OpenRouter Mixtral',
        description: 'Mistral AI com economia máxima',
        icon: '⚡',
        category: 'Chat Models',
        type: 'chatModel'
      },
    ]
  },
  {
    name: 'Vector Stores',
    icon: <Database className="w-4 h-4" />,
    nodes: [
      {
        id: 'supabase-vector',
        label: 'Supabase Vector',
        description: 'pgvector integration completa',
        icon: '📊',
        category: 'Vector Stores',
        type: 'vectorStore'
      },
      {
        id: 'pinecone',
        label: 'Pinecone',
        description: 'Vector database em nuvem',
        icon: '🌲',
        category: 'Vector Stores',
        type: 'vectorStore'
      },
    ]
  },
  {
    name: 'Document Loaders',
    icon: <FileText className="w-4 h-4" />,
    nodes: [
      {
        id: 'pdf-loader',
        label: 'PDF Loader',
        description: 'Carrega documentos PDF',
        icon: '📄',
        category: 'Document Loaders',
        type: 'documentLoader'
      },
      {
        id: 'web-scraper',
        label: 'Web Scraper',
        description: 'Extrai conteúdo de websites',
        icon: '🌐',
        category: 'Document Loaders',
        type: 'documentLoader'
      },
    ]
  },
  {
    name: 'Tools',
    icon: <Settings className="w-4 h-4" />,
    nodes: [
      {
        id: 'webhook',
        label: 'Webhook',
        description: 'Integração via webhook',
        icon: '🔗',
        category: 'Tools',
        type: 'tool'
      },
      {
        id: 'email',
        label: 'Email Sender',
        description: 'Envio de emails automatizado',
        icon: '📧',
        category: 'Tools',
        type: 'tool'
      },
    ]
  },
]

interface FlowSidebarProps {
  open: boolean
  onToggle: () => void
}

export function FlowSidebar({ open, onToggle }: FlowSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const onDragStart = (event: React.DragEvent, nodeTemplate: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', nodeTemplate.type)
    event.dataTransfer.setData('application/nodedata', JSON.stringify(nodeTemplate))
    event.dataTransfer.effectAllowed = 'move'
  }

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0)

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-200 ${
      open ? 'w-80' : 'w-12'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {open && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Componentes</h2>
            <p className="text-sm text-gray-500">Arraste para o canvas</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="ml-auto"
        >
          {open ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {open && (
        <>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar componentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories and Nodes */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <div 
                    className="flex items-center gap-2 mb-3 cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.name ? null : category.name
                    )}
                  >
                    {category.icon}
                    <span className="font-medium text-sm text-gray-700">
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {category.nodes.length}
                    </Badge>
                  </div>

                  {(selectedCategory === null || selectedCategory === category.name) && (
                    <div className="space-y-2 ml-6">
                      {category.nodes.map((node) => (
                        <div
                          key={node.id}
                          draggable
                          onDragStart={(event) => onDragStart(event, node)}
                          className="p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:bg-blue-50 transition-colors active:cursor-grabbing"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-lg">{node.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900">
                                {node.label}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {node.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div>🚀 ReactFlow v12</div>
              <div>🎯 Flowise Patterns</div>
              <div>💰 87% Margem OpenRouter</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}