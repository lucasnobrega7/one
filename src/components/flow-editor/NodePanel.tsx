"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NodePanelProps {
  onClose: () => void
  onAddNode: (type: string, data: any) => void
}

const nodeTypes = [
  {
    type: "intentNode",
    label: "Intent",
    description: "Detect user intent",
    defaultData: {
      label: "New Intent",
      intents: [],
    },
  },
  {
    type: "messageNode",
    label: "Message",
    description: "Send a message to the user",
    defaultData: {
      label: "New Message",
      message: "",
    },
  },
  {
    type: "actionNode",
    label: "Action",
    description: "Perform an action",
    defaultData: {
      label: "New Action",
      action: "",
      parameters: {},
    },
  },
  {
    type: "conditionNode",
    label: "Condition",
    description: "Branch based on a condition",
    defaultData: {
      label: "New Condition",
      condition: "",
      branches: ["true", "false"],
    },
  },
]

export function NodePanel({ onClose, onAddNode }: NodePanelProps) {
  return (
    <Card className="fixed right-4 top-20 w-80 z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Add Node</CardTitle>
          <CardDescription>Select a node type to add</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {nodeTypes.map((nodeType) => (
              <Button
                key={nodeType.type}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => onAddNode(nodeType.type, nodeType.defaultData)}
              >
                <div>
                  <div className="font-medium">{nodeType.label}</div>
                  <div className="text-xs text-muted-foreground">{nodeType.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
