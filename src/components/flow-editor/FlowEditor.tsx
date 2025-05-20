"use client"

import { useState, useCallback } from "react"
import ReactFlow, { Background, Controls, MiniMap, Panel, addEdge, type Connection } from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFlow } from "@/contexts/FlowContext"
import { IntentNode } from "./nodes/IntentNode"
import { MessageNode } from "./nodes/MessageNode"
import { ActionNode } from "./nodes/ActionNode"
import { ConditionNode } from "./nodes/ConditionNode"
import { NodeEditor } from "./NodeEditor"
import { Save, Undo, Redo, Play, Plus } from "lucide-react"

// Definir os tipos de nós personalizados
const nodeTypes = {
  intentNode: IntentNode,
  messageNode: MessageNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
}

interface FlowEditorProps {
  flowId: string
}

export function FlowEditor({ flowId }: FlowEditorProps) {
  const {
    flow,
    nodes,
    edges,
    setNodes,
    setEdges,
    loadFlow,
    saveFlow,
    updateFlowName,
    updateFlowDescription,
    undo,
    redo,
    canUndo,
    canRedo,
    loading,
    saving,
  } = useFlow()

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("editor")

  // Carregar o fluxo quando o componente for montado
  useState(() => {
    loadFlow(flowId)
  })

  // Manipuladores de eventos do ReactFlow
  const onNodesChange = useCallback(
    (changes) => {
      setNodes(changes)
    },
    [setNodes],
  )

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges(changes)
    },
    [setEdges],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
    },
    [setEdges],
  )

  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedNode(node.id)
    },
    [setSelectedNode],
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  // Adicionar um novo nó ao fluxo
  const addNode = useCallback(
    (type: string) => {
      const newNode = {
        id: `${type}_${Date.now()}`,
        type: `${type}Node`,
        position: { x: 100, y: 100 },
        data: {
          label: `Novo ${type}`,
          // Dados específicos para cada tipo de nó
          ...(type === "intent" && { patterns: [] }),
          ...(type === "message" && { content: "" }),
          ...(type === "action" && { actionType: "api", config: {} }),
          ...(type === "condition" && { condition: "", branches: [{ label: "Sim" }, { label: "Não" }] }),
        },
      }

      setNodes([...nodes, newNode])
    },
    [nodes, setNodes],
  )

  // Renderizar o editor de fluxo
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b p-2">
          <div className="flex items-center space-x-2">
            <Input
              value={flow?.name || ""}
              onChange={(e) => updateFlowName(e.target.value)}
              placeholder="Nome do fluxo"
              className="w-64"
            />
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="simulator">Simulador</TabsTrigger>
              <TabsTrigger value="code">Código</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
              <Undo className="h-4 w-4 mr-1" />
              Desfazer
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
              <Redo className="h-4 w-4 mr-1" />
              Refazer
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("simulator")}>
              <Play className="h-4 w-4 mr-1" />
              Testar
            </Button>
            <Button size="sm" onClick={saveFlow} disabled={saving}>
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        <TabsContent value="editor" className="flex-1 flex">
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
              <Panel position="top-right" className="bg-white rounded-md shadow-md p-2">
                <div className="flex flex-col space-y-1">
                  <Button size="sm" variant="outline" onClick={() => addNode("intent")}>
                    <Plus className="h-3 w-3 mr-1" />
                    Intent
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addNode("message")}>
                    <Plus className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addNode("action")}>
                    <Plus className="h-3 w-3 mr-1" />
                    Action
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addNode("condition")}>
                    <Plus className="h-3 w-3 mr-1" />
                    Condition
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {selectedNode && (
            <div className="w-80 border-l">
              <NodeEditor nodeId={selectedNode} onClose={() => setSelectedNode(null)} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="simulator" className="flex-1">
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Simulador de Fluxo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>O simulador permite testar o fluxo em tempo real.</p>
                {/* Implementação do simulador */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="code" className="flex-1">
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Código do Fluxo</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify({ nodes, edges }, null, 2)}</pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
