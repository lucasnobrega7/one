"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ArrowRight, Sparkles, Rocket, Users, Target } from "lucide-react"
import { PricingPlans } from "@/components/features/onboarding/pricing-plans"
import { CheckoutForm, CheckoutFormData } from "@/components/features/onboarding/checkout-form"
import { IntegrationSetup } from "@/components/features/onboarding/integration-setup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

type OnboardingStep = 'welcome' | 'pricing' | 'checkout' | 'integrations' | 'agent-setup' | 'templates' | 'complete'

interface SelectedPlan {
  id: string
  name: string
  price: number
  period: string
}

interface AgentConfig {
  name: string
  type: 'sales' | 'support' | 'marketing'
  personality: string
  instructions: string
}

export default function OnboardingPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null)
  const [checkoutData, setCheckoutData] = useState<CheckoutFormData | null>(null)
  const [integrations, setIntegrations] = useState<any>(null)
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    { id: 'welcome', title: 'Boas-vindas', description: 'Introdução à plataforma' },
    { id: 'pricing', title: 'Plano', description: 'Escolher plano ideal' },
    { id: 'checkout', title: 'Pagamento', description: 'Finalizar compra' },
    { id: 'integrations', title: 'Integrações', description: 'WhatsApp + OpenAI' },
    { id: 'agent-setup', title: 'Agente', description: 'Configurar primeiro agente' },
    { id: 'templates', title: 'Templates', description: 'Escolher modelos' },
    { id: 'complete', title: 'Concluído', description: 'Tudo pronto!' }
  ]

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep)
  const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100

  const handlePlanSelection = (planId: string) => {
    const plans = {
      'starter': { id: 'starter', name: 'Starter', price: 29, period: 'mês' },
      'professional': { id: 'professional', name: 'Professional', price: 99, period: 'mês' },
      'enterprise': { id: 'enterprise', name: 'Enterprise', price: 299, period: 'mês' }
    }
    setSelectedPlan(plans[planId as keyof typeof plans])
  }

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    setIsLoading(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setCheckoutData(formData)
      toast({
        title: "Pagamento processado!",
        description: "Bem-vindo à família Agentes de Conversão!"
      })
      setCurrentStep('integrations')
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Tente novamente ou entre em contato com o suporte",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleIntegrationsComplete = (integrationData: any) => {
    setIntegrations(integrationData)
    setCurrentStep('agent-setup')
  }

  const handleAgentSetup = async (config: AgentConfig) => {
    setIsLoading(true)
    
    try {
      // Create agent via API
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          integrations,
          plan: selectedPlan
        })
      })

      if (response.ok) {
        setAgentConfig(config)
        toast({
          title: "Agente criado!",
          description: `${config.name} está pronto para conversar!`
        })
        setCurrentStep('templates')
      }
    } catch (error) {
      toast({
        title: "Erro ao criar agente",
        description: "Tente novamente",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-white">Configuração Inicial</h1>
            <span className="text-sm text-gray-400">
              {getCurrentStepIndex() + 1} de {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-zinc-800" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {steps.map((step, index) => (
              <span 
                key={step.id} 
                className={`${index <= getCurrentStepIndex() ? 'text-blue-400' : 'text-gray-500'}`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-4xl mx-auto text-center"
            >
              <div className="mb-8">
                <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-white mb-4">
                  Bem-vindo aos Agentes de Conversão!
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Em poucos minutos você terá um agente AI funcionando 24/7, 
                  convertendo visitantes em clientes automaticamente.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6 text-center">
                    <Rocket className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-white mb-2">Setup Rápido</h3>
                    <p className="text-gray-400 text-sm">
                      Configuração em 7 passos simples, menos de 10 minutos
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-white mb-2">IA Avançada</h3>
                    <p className="text-gray-400 text-sm">
                      Powered by GPT-4, conversas naturais e inteligentes
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-900/50">
                  <CardContent className="p-6 text-center">
                    <Target className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-white mb-2">Mais Conversões</h3>
                    <p className="text-gray-400 text-sm">
                      Aumente suas vendas em até 300% com automação inteligente
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button
                size="lg"
                onClick={() => setCurrentStep('pricing')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Começar Configuração
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Pricing Step */}
          {currentStep === 'pricing' && (
            <motion.div
              key="pricing"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <PricingPlans 
                onSelectPlan={handlePlanSelection}
                selectedPlan={selectedPlan?.id}
              />
              {selectedPlan && (
                <div className="text-center mt-8">
                  <Button
                    size="lg"
                    onClick={() => setCurrentStep('checkout')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Continuar com {selectedPlan.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Checkout Step */}
          {currentStep === 'checkout' && selectedPlan && (
            <motion.div
              key="checkout"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CheckoutForm
                selectedPlan={selectedPlan}
                onSubmit={handleCheckoutSubmit}
                loading={isLoading}
              />
            </motion.div>
          )}

          {/* Integrations Step */}
          {currentStep === 'integrations' && (
            <motion.div
              key="integrations"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <IntegrationSetup onComplete={handleIntegrationsComplete} />
            </motion.div>
          )}

          {/* Agent Setup Step */}
          {currentStep === 'agent-setup' && (
            <motion.div
              key="agent-setup"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-2xl mx-auto"
            >
              <AgentSetupForm onSubmit={handleAgentSetup} loading={isLoading} />
            </motion.div>
          )}

          {/* Templates Step */}
          {currentStep === 'templates' && (
            <motion.div
              key="templates"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-4xl mx-auto"
            >
              <TemplateSelector onComplete={() => setCurrentStep('complete')} />
            </motion.div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-2xl mx-auto text-center"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">
                🎉 Parabéns! Tudo Configurado!
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Seu agente AI está ativo e pronto para converter visitantes em clientes. 
                Vamos para o dashboard ver ele em ação!
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="border-green-600 bg-green-900/20">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-green-400 text-sm">Agente AI Ativo</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-600 bg-blue-900/20">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-blue-400 text-sm">WhatsApp Conectado</p>
                  </CardContent>
                </Card>
              </div>

              <Button
                size="lg"
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Ir para o Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Agent Setup Form Component
function AgentSetupForm({ onSubmit, loading }: { onSubmit: (config: AgentConfig) => void, loading: boolean }) {
  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    type: 'sales',
    personality: 'friendly',
    instructions: ''
  })

  const agentTypes = [
    { id: 'sales', name: 'Vendas', description: 'Converte visitantes em clientes', emoji: '💰' },
    { id: 'support', name: 'Suporte', description: 'Resolve dúvidas e problemas', emoji: '🛟' },
    { id: 'marketing', name: 'Marketing', description: 'Gera leads e engagement', emoji: '📈' }
  ]

  const personalities = [
    { id: 'friendly', name: 'Amigável', description: 'Caloroso e acolhedor' },
    { id: 'professional', name: 'Profissional', description: 'Formal e direto' },
    { id: 'casual', name: 'Descontraído', description: 'Informal e divertido' }
  ]

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <CardTitle className="text-white">Configure seu Primeiro Agente</CardTitle>
        <CardDescription>
          Personalize a personalidade e comportamento do seu agente AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-gray-300 block mb-2">Nome do Agente</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig({...config, name: e.target.value})}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2"
            placeholder="Ex: Sofia - Assistente de Vendas"
          />
        </div>

        <div>
          <label className="text-gray-300 block mb-2">Tipo de Agente</label>
          <div className="grid grid-cols-3 gap-4">
            {agentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setConfig({...config, type: type.id as any})}
                className={`p-4 rounded-lg border text-center ${
                  config.type === type.id 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <div className="text-2xl mb-2">{type.emoji}</div>
                <div className="text-white font-medium">{type.name}</div>
                <div className="text-gray-400 text-xs">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-gray-300 block mb-2">Personalidade</label>
          <div className="space-y-2">
            {personalities.map((personality) => (
              <label key={personality.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="personality"
                  value={personality.id}
                  checked={config.personality === personality.id}
                  onChange={(e) => setConfig({...config, personality: e.target.value})}
                  className="text-blue-500"
                />
                <div>
                  <div className="text-white">{personality.name}</div>
                  <div className="text-gray-400 text-sm">{personality.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-gray-300 block mb-2">Instruções Especiais (Opcional)</label>
          <textarea
            value={config.instructions}
            onChange={(e) => setConfig({...config, instructions: e.target.value})}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 h-24"
            placeholder="Ex: Sempre mencione nossa garantia de 30 dias..."
          />
        </div>

        <Button
          onClick={() => onSubmit(config)}
          disabled={!config.name || loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {loading ? 'Criando Agente...' : 'Criar Agente'}
        </Button>
      </CardContent>
    </Card>
  )
}

// Template Selector Component
function TemplateSelector({ onComplete }: { onComplete: () => void }) {
  const templates = [
    { id: 'ecommerce', name: 'E-commerce', description: 'Loja virtual, produtos, carrinho' },
    { id: 'services', name: 'Serviços', description: 'Consultoria, agendamentos, orçamentos' },
    { id: 'saas', name: 'SaaS', description: 'Software, trials, demos' },
    { id: 'real-estate', name: 'Imóveis', description: 'Visitas, financiamento, propostas' }
  ]

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <CardTitle className="text-white">Escolha um Template</CardTitle>
        <CardDescription>
          Selecione o modelo que melhor se adequa ao seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {templates.map((template) => (
            <button
              key={template.id}
              className="p-6 border border-zinc-700 rounded-lg hover:border-zinc-600 text-left"
            >
              <h3 className="text-white font-medium mb-2">{template.name}</h3>
              <p className="text-gray-400 text-sm">{template.description}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onComplete}
            className="border-zinc-700 hover:border-zinc-600"
          >
            Pular Templates
          </Button>
          <Button
            onClick={onComplete}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Aplicar Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}