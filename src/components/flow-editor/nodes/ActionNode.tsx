"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Zap } from "lucide-react"

export const ActionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`p-3 rounded-md border ${selected ? "border-primary" : "border-border"} bg-card shadow-sm w-60`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2">
        <div className="bg-purple-100 p-2 rounded-md">
          <Zap className="h-4 w-4 text-purple-600" />
        </div>
        <div className="font-medium truncate">{data.label}</div>
      </div>

      {data.action && (
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="font-medium mb-1">Action:</div>
          <div className="bg-muted p-2 rounded-md">{data.action}</div>

          {data.parameters && Object.keys(data.parameters).length > 0 && (
            <div className="mt-1">
              <div className="font-medium mb-1">Parameters:</div>
              <div className="bg-muted p-2 rounded-md max-h-20 overflow-hidden">
                {Object.entries(data.parameters).map(([key, value]) => (
                  <div key={key} className="truncate">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
})

ActionNode.displayName = "ActionNode"
