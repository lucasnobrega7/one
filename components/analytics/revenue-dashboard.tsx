"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { useRevenueAnalytics } from "@/lib/analytics/revenue-analytics"

export function RevenueDashboard() {
  const { 
    currentMonth, 
    costOptimizationSavings, 
    topCustomers, 
    alerts, 
    recommendations,
    isLoading 
  } = useRevenueAnalytics()

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-start"></div>
    </div>
  }

  const profitMarginColor = currentMonth.profitMargin > 0.8 ? 'text-green-400' : 
                           currentMonth.profitMargin > 0.5 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {currentMonth.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ArrowUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">+23% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Margem de Lucro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitMarginColor}`}>
              {(currentMonth.profitMargin * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-white/60 mt-1">
              R$ {currentMonth.grossProfit.toLocaleString()} lucro
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {currentMonth.totalCustomers}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ArrowUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">+{currentMonth.newCustomers} novos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Economia IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              R$ {costOptimizationSavings.toLocaleString()}
            </div>
            <div className="text-sm text-white/60 mt-1">
              vs OpenAI direto
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader>
            <CardTitle className="text-white">Composição da Receita</CardTitle>
            <CardDescription className="text-white/60">
              Distribuição das fontes de receita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Assinaturas</span>
                <span className="text-white font-medium">
                  R$ {currentMonth.subscriptionRevenue.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(currentMonth.subscriptionRevenue / currentMonth.totalRevenue) * 100} 
                className="h-2"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-white/80">Uso Extra</span>
                <span className="text-white font-medium">
                  R$ {currentMonth.usageRevenue.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(currentMonth.usageRevenue / currentMonth.totalRevenue) * 100} 
                className="h-2"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-white/80">Add-ons</span>
                <span className="text-white font-medium">
                  R$ {currentMonth.addOnRevenue.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(currentMonth.addOnRevenue / currentMonth.totalRevenue) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader>
            <CardTitle className="text-white">Estrutura de Custos</CardTitle>
            <CardDescription className="text-white/60">
              Onde estamos gastando nossos recursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">IA / OpenRouter</span>
                <span className="text-green-400 font-medium">
                  R$ {currentMonth.aiCosts.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(currentMonth.aiCosts / currentMonth.totalCosts) * 100} 
                className="h-2"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-white/80">Infraestrutura</span>
                <span className="text-white font-medium">
                  R$ {currentMonth.infrastructureCosts.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(currentMonth.infrastructureCosts / currentMonth.totalCosts) * 100} 
                className="h-2"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-white/80">Suporte</span>
                <span className="text-white font-medium">
                  R$ {currentMonth.supportCosts.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(currentMonth.supportCosts / currentMonth.totalCosts) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers & Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader>
            <CardTitle className="text-white">Top Clientes por LTV</CardTitle>
            <CardDescription className="text-white/60">
              Clientes mais valiosos e oportunidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.userId} className="flex items-center justify-between p-3 bg-surface-base rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent-start to-accent-end rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{customer.tier}</div>
                      <div className="text-sm text-white/60">
                        Churn Risk: {(customer.churnRisk * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      R$ {customer.estimatedLTV.toLocaleString()}
                    </div>
                    {customer.upgradeOpportunity && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                        Upgrade para {customer.upgradeOpportunity}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader>
            <CardTitle className="text-white">Recomendações</CardTitle>
            <CardDescription className="text-white/60">
              Otimizações para aumentar rentabilidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-surface-base rounded-lg border border-surface-stroke">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      rec.impact === 'high' ? 'bg-red-400' :
                      rec.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <div className="flex-1">
                      <div className="text-white text-sm">{rec.recommendation}</div>
                      <div className="text-green-400 text-xs mt-1">
                        Potencial: +R$ {rec.potentialSavings.toLocaleString()}
                      </div>
                    </div>
                    <Badge variant={rec.impact === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                      {rec.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-surface-raised border-surface-stroke">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Alertas & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm">{alert}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Summary */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Resumo da Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">87%</div>
              <div className="text-sm text-white/60">Margem de Lucro</div>
              <div className="text-xs text-green-400 mt-1">🎯 Meta: &gt;80%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">R$ {currentMonth.arpu}</div>
              <div className="text-sm text-white/60">ARPU Médio</div>
              <div className="text-xs text-blue-400 mt-1">📈 +15% vs meta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">85%</div>
              <div className="text-sm text-white/60">Economia AI</div>
              <div className="text-xs text-purple-400 mt-1">💰 OpenRouter savings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}