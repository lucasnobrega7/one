"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { MessageSquare } from "lucide-react"

export const IntentNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`p-3 rounded-md border ${selected ? "border-primary" : "border-border"} bg-card shadow-sm w-60`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2">
        <div className="bg-orange-100 p-2 rounded-md">
          <MessageSquare className="h-4 w-4 text-orange-600" />
        </div>
        <div className="font-medium truncate">{data.label}</div>
      </div>

      {data.intents && data.intents.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="font-medium mb-1">Intents:</div>
          <ul className="list-disc pl-4">
            {data.intents.slice(0, 3).map((intent: string, index: number) => (
              <li key={index} className="truncate">
                {intent}
              </li>
            ))}
            {data.intents.length > 3 && <li>+{data.intents.length - 3} more</li>}
          </ul>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
})

IntentNode.displayName = "IntentNode"
