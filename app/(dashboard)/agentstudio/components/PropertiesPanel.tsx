'use client'

import { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext'

interface PropertiesPanelProps {
  nodeId: string
  onClose: () => void
}

const openRouterModels = [
  { name: 'Claude 3.5 Sonnet', value: 'anthropic/claude-3.5-sonnet' },
  { name: 'GPT-4 Turbo', value: 'openai/gpt-4-turbo' },
  { name: 'GPT-3.5 Turbo', value: 'openai/gpt-3.5-turbo' },
]

export default function PropertiesPanel({ nodeId, onClose }: PropertiesPanelProps) {
  const { nodes, updateNode, deleteNode } = useWorkflow()
  const [properties, setProperties] = useState<any>({})
  
  const selectedNode = nodes.find(n => n.id === nodeId)

  useEffect(() => {
    if (selectedNode?.data) {
      setProperties(selectedNode.data)
    }
  }, [selectedNode])

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...properties, [key]: value }
    setProperties(newProperties)
    if (selectedNode) {
      updateNode(nodeId, newProperties)
    }
  }

  if (!selectedNode) return null

  return (
    <div className="w-96 bg-[#252525] border-l border-[#2a2a2a] flex flex-col">
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">{selectedNode.data.label}</h2>
        <button onClick={onClose} className="p-1 hover:bg-[#3a3a3a] rounded">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedNode.data.type === 'openai' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Model</label>
              <select
                value={properties.model || 'anthropic/claude-3.5-sonnet'}
                onChange={(e) => handlePropertyChange('model', e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-sm text-white"
              >
                {openRouterModels.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Prompt</label>
              <textarea
                value={properties.prompt || ''}
                onChange={(e) => handlePropertyChange('prompt', e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-sm text-white"
                rows={4}
                placeholder="Enter your prompt..."
              />
            </div>
          </>
        )}

        {selectedNode.data.type === 'webhook' && (
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Path</label>
            <input
              type="text"
              value={properties.path || '/webhook'}
              onChange={(e) => handlePropertyChange('path', e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-sm text-white"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Node Name</label>
          <input
            type="text"
            value={properties.label || ''}
            onChange={(e) => handlePropertyChange('label', e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-sm text-white"
          />
        </div>
      </div>
      
      <div className="p-4 border-t border-[#2a2a2a]">
        <button
          onClick={() => { deleteNode(nodeId); onClose(); }}
          className="w-full bg-red-600/20 text-red-400 px-4 py-2 rounded hover:bg-red-600/30 flex items-center justify-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Node</span>
        </button>
      </div>
    </div>
  )
}