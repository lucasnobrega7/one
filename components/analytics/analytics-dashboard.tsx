"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Painel de Análises</h1>
          <p className="text-gray-400">
            Monitore o desempenho dos seus agentes e conversas
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gray-900/50 border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total de Conversas</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-400">+12%</Badge>
          </div>
        </Card>
        <Card className="p-6 bg-gray-900/50 border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-white">28.5%</p>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-400">+5.2%</Badge>
          </div>
        </Card>
        <Card className="p-6 bg-gray-900/50 border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Agentes Ativos</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">+2</Badge>
          </div>
        </Card>        <Card className="p-6 bg-gray-900/50 border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Tempo Médio</p>
              <p className="text-2xl font-bold text-white">2.3min</p>
            </div>
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-400">-0.5min</Badge>
          </div>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gray-900/50 border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-white">Conversas por Período</h3>
          <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center">
            <p className="text-gray-400">Gráfico de conversas em desenvolvimento</p>
          </div>
        </Card>
        <Card className="p-6 bg-gray-900/50 border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-white">Métricas em Tempo Real</h3>
          <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center">
            <p className="text-gray-400">Métricas em tempo real em desenvolvimento</p>
          </div>
        </Card>
      </div>

      {/* Performance Table Placeholder */}
      <Card className="p-6 bg-gray-900/50 border-gray-700/50">
        <h3 className="text-lg font-semibold mb-4 text-white">Performance dos Agentes</h3>
        <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center">
          <p className="text-gray-400">Tabela de performance em desenvolvimento</p>
        </div>
      </Card>
    </div>
  )
}