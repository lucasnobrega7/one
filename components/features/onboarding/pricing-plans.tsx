"use client"

import { useState } from "react"
import { Check, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfeito para começar com IA",
    price: 29,
    period: "mês",
    features: [
      "1 Agente AI",
      "1.000 mensagens/mês",
      "Integração WhatsApp",
      "Modelos GPT-3.5",
      "Suporte por email"
    ],
    icon: Zap,
    popular: false
  },
  {
    id: "professional",
    name: "Professional",
    description: "Para empresas em crescimento",
    price: 99,
    period: "mês",
    features: [
      "5 Agentes AI",
      "10.000 mensagens/mês",
      "Integração WhatsApp + API",
      "Modelos GPT-4",
      "Fluxos avançados",
      "Analytics detalhados",
      "Suporte prioritário"
    ],
    icon: Crown,
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Solução completa para grandes empresas",
    price: 299,
    period: "mês",
    features: [
      "Agentes ilimitados",
      "Mensagens ilimitadas",
      "Todas as integrações",
      "Modelos personalizados",
      "API dedicada",
      "Relatórios customizados",
      "Suporte dedicado 24/7",
      "Onboarding personalizado"
    ],
    icon: Crown,
    popular: false
  }
]

interface PricingPlansProps {
  onSelectPlan: (planId: string) => void
  selectedPlan?: string
}

export function PricingPlans({ onSelectPlan, selectedPlan }: PricingPlansProps) {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Escolha o plano ideal para você
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Comece sua jornada com IA conversacional. Todos os planos incluem 14 dias grátis.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isSelected = selectedPlan === plan.id
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:scale-105 cursor-pointer ${
                plan.popular 
                  ? 'border-gradient-purple scale-105' 
                  : 'border-zinc-800 hover:border-zinc-700'
              } ${
                isSelected ? 'border-blue-500 shadow-blue-500/20 shadow-xl' : ''
              }`}
              onClick={() => onSelectPlan(plan.id)}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1"
                >
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-zinc-800'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">R${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                      : isSelected
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                  size="lg"
                >
                  {isSelected ? 'Selecionado' : 'Selecionar Plano'}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}