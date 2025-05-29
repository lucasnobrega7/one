'use client'

import { useState } from 'react'
import { Search, ChevronRight, ChevronDown, Webhook, Code, MessageSquare, Database, Timer } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext'

interface NodeType {
  id: string
  name: string
  type: string
  icon: React.ElementType
  color: string
}

const nodeTypes: NodeType[] = [
  { id: 'webhook', name: 'Webhook', type: 'webhook', icon: Webhook, color: '#ff6d5a' },
  { id: 'manual', name: 'Manual Trigger', type: 'manual', icon: Timer, color: '#ff6d5a' },
  { id: 'javascript', name: 'JavaScript', type: 'javascript', icon: Code, color: '#f5a623' },
  { id: 'openai', name: 'OpenAI', type: 'openai', icon: MessageSquare, color: '#10a37f' },
  { id: 'set', name: 'Set Data', type: 'set', icon: Database, color: '#4a90e2' },
]

export default function NodeLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const { addNode } = useWorkflow()

  const filteredNodes = nodeTypes.filter(node =>
    node.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    const nodeData = {
      type: nodeType.type,
      data: {
        label: nodeType.name,
        type: nodeType.type,
        color: nodeType.color,
      }
    }
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-80 bg-[#252525] border-r border-[#2a2a2a] flex flex-col">
      <div className="p-4 border-b border-[#2a2a2a]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#ff6d5a]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredNodes.map(node => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => handleDragStart(e, node)}
            className="p-3 rounded cursor-move hover:bg-[#2a2a2a] transition-colors mb-2"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: `${node.color}20` }}
              >
                <node.icon 
                  className="w-4 h-4" 
                  style={{ color: node.color }}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{node.name}</div>
                <div className="text-xs text-gray-400">{node.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="text-xs text-gray-500 text-center">
          Drag nodes to canvas
        </div>
      </div>
    </div>
  )
}