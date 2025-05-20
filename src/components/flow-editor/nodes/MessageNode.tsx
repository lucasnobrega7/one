"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { MessageCircle } from "lucide-react"

export const MessageNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`p-3 rounded-md border ${selected ? "border-primary" : "border-border"} bg-card shadow-sm w-60`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded-md">
          <MessageCircle className="h-4 w-4 text-blue-600" />
        </div>
        <div className="font-medium truncate">{data.label}</div>
      </div>

      {data.message && (
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="font-medium mb-1">Message:</div>
          <div className="bg-muted p-2 rounded-md max-h-20 overflow-hidden">
            {data.message.length > 100 ? `${data.message.substring(0, 100)}...` : data.message}
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
})

MessageNode.displayName = "MessageNode"
