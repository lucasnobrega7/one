'use client'

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Webhook, Code, MessageSquare, Database, Timer } from 'lucide-react'

interface CustomNodeData {
  label: string
  type: string
  color?: string
}

const nodeIcons: Record<string, React.ElementType> = {
  webhook: Webhook,
  manual: Timer,
  javascript: Code,
  openai: MessageSquare,
  set: Database,
}

const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const Icon = nodeIcons[data.type] || Database

  return (
    <div 
      className={`
        relative min-w-[180px] rounded-lg border-2 transition-all duration-200
        ${selected ? 'border-[#ff6d5a] shadow-lg shadow-[#ff6d5a]/20' : 'border-[#3a3a3a]'}
        bg-[#404040] hover:shadow-lg cursor-pointer
      `}
    >
      <div 
        className="px-4 py-3 border-b border-[#3a3a3a] rounded-t-lg"
        style={{ backgroundColor: data.color ? `${data.color}15` : 'transparent' }}
      >
        <div className="flex items-center space-x-2">
          <Icon 
            className="w-4 h-4" 
            style={{ color: data.color || '#666' }}
          />
          <span className="text-sm font-medium text-white truncate">
            {data.label}
          </span>
        </div>
      </div>

      <div className="px-4 py-2">
        <p className="text-xs text-gray-400">
          {data.type}
        </p>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-[#525252] !border-2 !border-[#3a3a3a] hover:!bg-[#ff6d5a]"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[#525252] !border-2 !border-[#3a3a3a] hover:!bg-[#ff6d5a]"
      />
    </div>
  )
})

CustomNode.displayName = 'CustomNode'

export default CustomNode