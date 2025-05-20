"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { GitBranch } from "lucide-react"

export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`p-3 rounded-md border ${selected ? "border-primary" : "border-border"} bg-card shadow-sm w-60`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2">
        <div className="bg-green-100 p-2 rounded-md">
          <GitBranch className="h-4 w-4 text-green-600" />
        </div>
        <div className="font-medium truncate">{data.label}</div>
      </div>

      {data.condition && (
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="font-medium mb-1">Condition:</div>
          <div className="bg-muted p-2 rounded-md">
            {data.condition.length > 100 ? `${data.condition.substring(0, 100)}...` : data.condition}
          </div>
        </div>
      )}

      {data.branches && data.branches.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="font-medium mb-1">Branches:</div>
          <div className="flex flex-wrap gap-1">
            {data.branches.map((branch: string, index: number) => (
              <div key={index} className="bg-muted px-2 py-1 rounded-md">
                {branch}
                <Handle
                  id={`branch-${index}`}
                  type="source"
                  position={Position.Bottom}
                  className="w-2 h-2"
                  style={{ left: `${(index + 1) * (100 / (data.branches.length + 1))}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

ConditionNode.displayName = "ConditionNode"
