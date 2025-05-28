"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquare, MoreHorizontal, Edit, Trash2, Copy, Play } from "lucide-react"

// Dados de exemplo para agentes
const mockAgents = [
  {
    id: "1",
    name: "Agente de Vendas",
    description: "Especializado em converter leads em clientes",
    createdAt: "2023-10-15",
    status: "active",
    conversations: 156,
    conversionRate: 18.5,
  },
  {
    id: "2",
    name: "Agente de Suporte",
    description: "Fornece suporte técnico e resolve problemas dos clientes",
    createdAt: "2023-09-22",
    status: "active",
    conversations: 243,
    conversionRate: 0,
  },
  {
    id: "3",
    name: "Agente de Onboarding",
    description: "Guia novos usuários através do processo de integração",
    createdAt: "2023-11-05",
    status: "inactive",
    conversations: 87,
    conversionRate: 0,
  },
]

export function AgentsList() {
  const [agents, setAgents] = useState(mockAgents)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(id)
    }
  }

  const handleDelete = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id))
    setActiveDropdown(null)
  }

  return (
    <div className="bg-[#1a1a1d] border border-[#27272a] rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0e0e10] border-b border-[#27272a]">
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Conversas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Taxa de Conversão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Criado em
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a] bg-[#1a1a1d]">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-[#27272a]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-slate-900">{agent.name}</div>
                      <div className="text-sm text-slate-600">{agent.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      agent.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {agent.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{agent.conversations}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{agent.conversionRate > 0 ? `${agent.conversionRate}%` : "N/A"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {new Date(agent.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block text-left">
                    <button onClick={() => toggleDropdown(agent.id)} className="text-slate-600 hover:text-slate-900">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {activeDropdown === agent.id && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-slate-200 z-10">
                        <div className="py-1">
                          <Link
                            href={`/dashboard/agents/${agent.id}`}
                            className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar Chat
                          </Link>
                          <Link
                            href={`/dashboard/agents/${agent.id}/edit`}
                            className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </button>
                          <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                            onClick={() => handleDelete(agent.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
