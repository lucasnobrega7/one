"use client"

import { Handle, Position } from '@xyflow/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CustomNodeProps {
  data: {
    label: string
    category: string
    icon: string
    description: string
  }
}

export function CustomNode({ data }: CustomNodeProps) {
  return (
    <Card className="w-64 p-4 shadow-lg border-2 border-gray-200 hover:border-blue-300 bg-white">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <span className="text-2xl">{data.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-gray-900">{data.label}</h3>
            <Badge variant="outline" className="text-xs">
              {data.category}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">{data.description}</p>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </Card>
  )
}