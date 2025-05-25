"use client"

import { useCallback, useState } from 'react'
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Save } from 'lucide-react'

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Início da Conversa' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Saudação' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    data: { label: 'Qualificação' },
    position: { x: 400, y: 125 },
  },
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
]

export function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isRunning, setIsRunning] = useState(false)

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleSave = () => {
    // Implementar salvamento
  }

  const handleToggleRun = () => {
    setIsRunning(!isRunning)
  }

  return (
    <Card className="h-[600px] overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Flow Builder</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm" onClick={handleToggleRun}>
              {isRunning ? (
                <><Pause className="h-4 w-4 mr-2" />Pausar</>
              ) : (
                <><Play className="h-4 w-4 mr-2" />Executar</>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </Card>
  )
}