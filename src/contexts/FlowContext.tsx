"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { IFlow, INode, IEdge, IFlowValidationResult } from "@/lib/interfaces/flow"
import { chatflowsService } from "@/lib/services"
import { useToast } from "@/components/ui/use-toast"

interface FlowContextProps {
  flow: IFlow | null
  loading: boolean
  saving: boolean
  nodes: INode[]
  edges: IEdge[]
  setNodes: (nodes: INode[]) => void
  setEdges: (edges: IEdge[]) => void
  loadFlow: (id: string) => Promise<void>
  saveFlow: () => Promise<void>
  updateFlowName: (name: string) => void
  updateFlowDescription: (description: string) => void
  addNode: (node: INode) => void
  updateNode: (id: string, data: any) => void
  removeNode: (id: string) => void
  addEdge: (edge: IEdge) => void
  removeEdge: (id: string) => void
  validateFlow: () => IFlowValidationResult
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const FlowContext = createContext<FlowContextProps | undefined>(undefined)

export const useFlow = () => {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider")
  }
  return context
}

interface FlowProviderProps {
  children: React.ReactNode
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
  const [flow, setFlow] = useState<IFlow | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [nodes, setNodesState] = useState<INode[]>([])
  const [edges, setEdgesState] = useState<IEdge[]>([])
  const [history, setHistory] = useState<{ nodes: INode[]; edges: IEdge[] }[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const { toast } = useToast()

  // Função para salvar o estado atual no histórico
  const saveToHistory = useCallback(() => {
    // Limitar o histórico a 20 estados
    const newHistory = history.slice(0, historyIndex + 1).slice(-19)
    setHistory([...newHistory, { nodes, edges }])
    setHistoryIndex(newHistory.length)
  }, [history, historyIndex, nodes, edges])

  // Funções para desfazer e refazer
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const { nodes: prevNodes, edges: prevEdges } = history[newIndex]
      setNodesState(prevNodes)
      setEdgesState(prevEdges)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const { nodes: nextNodes, edges: nextEdges } = history[newIndex]
      setNodesState(nextNodes)
      setEdgesState(nextEdges)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex])

  // Wrappers para setNodes e setEdges que salvam no histórico
  const setNodes = useCallback(
    (newNodes: INode[]) => {
      setNodesState(newNodes)
      saveToHistory()
    },
    [saveToHistory],
  )

  const setEdges = useCallback(
    (newEdges: IEdge[]) => {
      setEdgesState(newEdges)
      saveToHistory()
    },
    [saveToHistory],
  )

  // Inicializar o histórico quando o fluxo é carregado
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      if (history.length === 0) {
        setHistory([{ nodes, edges }])
        setHistoryIndex(0)
      }
    }
  }, [nodes, edges, history.length])

  const loadFlow = async (id: string) => {
    try {
      setLoading(true)
      const response = await chatflowsService.getSpecificChatflow(id)

      // Assumindo que a resposta tem uma propriedade data com o fluxo
      const flowData = response.data

      setFlow(flowData)
      setNodesState(flowData.nodes || [])
      setEdgesState(flowData.edges || [])

      // Resetar o histórico quando um novo fluxo é carregado
      setHistory([{ nodes: flowData.nodes || [], edges: flowData.edges || [] }])
      setHistoryIndex(0)
    } catch (error) {
      console.error("Error loading flow:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar o fluxo. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveFlow = async () => {
    if (!flow) return

    try {
      setSaving(true)
      const updatedFlow = {
        ...flow,
        nodes,
        edges,
      }

      await chatflowsService.updateChatflow(flow.id, updatedFlow)

      toast({
        title: "Sucesso",
        description: "Fluxo salvo com sucesso",
      })
    } catch (error) {
      console.error("Error saving flow:", error)
      toast({
        title: "Erro",
        description: "Falha ao salvar o fluxo. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateFlowName = (name: string) => {
    if (!flow) return
    setFlow({ ...flow, name })
  }

  const updateFlowDescription = (description: string) => {
    if (!flow) return
    setFlow({ ...flow, description })
  }

  const addNode = (node: INode) => {
    setNodes([...nodes, node])
  }

  const updateNode = (id: string, data: any) => {
    const updatedNodes = nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node))
    setNodes(updatedNodes)
  }

  const removeNode = (id: string) => {
    const filteredNodes = nodes.filter((node) => node.id !== id)
    const filteredEdges = edges.filter((edge) => edge.source !== id && edge.target !== id)

    setNodes(filteredNodes)
    setEdges(filteredEdges)
  }

  const addEdge = (edge: IEdge) => {
    setEdges([...edges, edge])
  }

  const removeEdge = (id: string) => {
    const filteredEdges = edges.filter((edge) => edge.id !== id)
    setEdges(filteredEdges)
  }

  const validateFlow = (): IFlowValidationResult => {
    const errors: string[] = []

    // Verificar se há nós sem conexões
    const orphanNodes = nodes.filter(
      (node) => !edges.some((edge) => edge.source === node.id || edge.target === node.id),
    )

    if (orphanNodes.length > 0) {
      errors.push(`Existem ${orphanNodes.length} nós desconectados no fluxo.`)
    }

    // Verificar se há nós de condição sem todas as saídas necessárias
    const conditionNodes = nodes.filter((node) => node.type === "conditionNode")
    for (const node of conditionNodes) {
      const outgoingEdges = edges.filter((edge) => edge.source === node.id)
      if (node.data.branches && outgoingEdges.length < node.data.branches.length) {
        errors.push(`O nó de condição "${node.data.label}" não tem todas as saídas necessárias.`)
      }
    }

    // Verificar se há ciclos no fluxo (implementação simplificada)
    // Uma implementação mais robusta usaria um algoritmo de detecção de ciclos como DFS

    return { valid: errors.length === 0, errors }
  }

  return (
    <FlowContext.Provider
      value={{
        flow,
        loading,
        saving,
        nodes,
        edges,
        setNodes,
        setEdges,
        loadFlow,
        saveFlow,
        updateFlowName,
        updateFlowDescription,
        addNode,
        updateNode,
        removeNode,
        addEdge,
        removeEdge,
        validateFlow,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}
