"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PricingPlans } from "@/components/features/onboarding/pricing-plans"
import { CheckoutForm, type CheckoutFormData } from "@/components/features/onboarding/checkout-form"
import { IntegrationSetup } from "@/components/features/onboarding/integration-setup"
import { apiClient } from "@/lib/unified/api-client"
import { useToast } from "@/components/ui/use-toast"

type OnboardingStep = 
  | "pricing" 
  | "checkout" 
  | "welcome" 
  | "integrations" 
  | "complete"

const steps = [
  { id: "pricing", title: "Escolher Plano", description: "Selecione o plano ideal" },
  { id: "checkout", title: "Pagamento", description: "Finalize sua assinatura" },
  { id: "welcome", title: "Boas-vindas", description: "Configuração da conta" },
  { id: "integrations", title: "Integrações", description: "WhatsApp e OpenAI" },
  { id: "complete", title: "Concluído", description: "Pronto para usar!" }
]

const plans = {
  starter: { id: "starter", name: "Starter", price: 29, period: "mês" },
  professional: { id: "professional", name: "Professional", price: 99, period: "mês" },
  enterprise: { id: "enterprise", name: "Enterprise", price: 299, period: "mês" }
}

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("pricing")
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [paymentData, setPaymentData] = useState<CheckoutFormData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar se usuário já completou onboarding
    if (session?.user?.id) {
      checkOnboardingStatus()
    }
  }, [session])

  const checkOnboardingStatus = async () => {
    try {
      // Verificar na API se onboarding já foi concluído
      const response = await apiClient.listAgents({ userId: session?.user?.id })
      
      if (response.success && response.data && response.data.length > 0) {
        // Usuário já tem agentes, redirecionar para dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Erro ao verificar status de onboarding:", error)
    }
  }

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex()
    return ((currentIndex + 1) / steps.length) * 100
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    setLoading(true)
    setPaymentData(formData)

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Criar registro de assinatura
      const subscriptionData = {
        userId: session?.user?.id,
        planId: selectedPlan,
        status: "active",
        paymentMethod: "card",
        billingInfo: formData
      }

      // Aqui você integraria com seu sistema de pagamento
      console.log("Processando pagamento:", subscriptionData)

      toast({
        title: "Pagamento processado!",
        description: "Sua assinatura foi ativada com sucesso."
      })

      setCurrentStep("welcome")
    } catch (error) {
      console.error("Erro no pagamento:", error)
      toast({
        title: "Erro no pagamento",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleIntegrationsComplete = async (integrations: any) => {
    setLoading(true)

    try {
      // Criar organização/workspace do usuário
      const orgData = {
        name: `${paymentData?.firstName || "Meu"} Workspace`,
        ownerId: session?.user?.id,
        plan: selectedPlan,
        settings: {
          whatsapp: integrations.whatsapp,
          openai: integrations.openai
        }
      }

      console.log("Criando organização:", orgData)

      // Criar primeiro agente de boas-vindas
      const welcomeAgent = {
        name: "Assistente de Boas-vindas",
        description: "Seu primeiro agente para testar a plataforma",
        instructions: "Você é um assistente amigável que ajuda novos usuários a entender a plataforma Agentes de Conversão. Seja educado, prestativo e sempre ofereça ajuda para criar novos agentes.",
        modelId: integrations.openai.model,
        temperature: 0.7,
        isPublic: false,
        userId: session?.user?.id
      }

      const agentResponse = await apiClient.createAgent(welcomeAgent)
      
      if (agentResponse.success) {
        toast({
          title: "Agente criado!",
          description: "Seu primeiro agente foi criado com sucesso."
        })
      }

      setCurrentStep("complete")
    } catch (error) {
      console.error("Erro ao finalizar onboarding:", error)
      toast({
        title: "Erro na configuração",
        description: "Houve um problema. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as OnboardingStep)
    }
  }

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as OnboardingStep)
    }
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header com Progress */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo aos Agentes de Conversão
            </h1>
            <p className="text-gray-300">
              Vamos configurar sua conta em poucos passos
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <Progress value={getProgressPercentage()} className="h-2 mb-4" />
            <div className="flex justify-between text-sm">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = getCurrentStepIndex() > index
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-2 ${
                      isActive ? 'text-blue-400' : 
                      isCompleted ? 'text-green-400' : 'text-gray-500'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      isActive ? 'bg-blue-600' : 
                      isCompleted ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="hidden sm:block">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">{step.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === "pricing" && (
            <div>
              <PricingPlans
                onSelectPlan={handlePlanSelect}
                selectedPlan={selectedPlan}
              />
              
              <div className="flex justify-center mt-8">
                <Button
                  onClick={nextStep}
                  disabled={!selectedPlan}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === "checkout" && selectedPlan && (
            <div>
              <CheckoutForm
                selectedPlan={plans[selectedPlan as keyof typeof plans]}
                onSubmit={handleCheckoutSubmit}
                loading={loading}
              />
              
              <div className="flex justify-center mt-8">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
              </div>
            </div>
          )}

          {currentStep === "welcome" && (
            <Card className="max-w-2xl mx-auto p-8 border-zinc-800 bg-zinc-900/50">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Pagamento Confirmado! 🎉
                </h2>
                <p className="text-gray-300 mb-6">
                  Sua assinatura do plano <strong>{plans[selectedPlan as keyof typeof plans]?.name}</strong> foi ativada com sucesso.
                </p>
                <p className="text-gray-300 mb-8">
                  Agora vamos configurar suas integrações para você começar a usar seus agentes de IA.
                </p>
                
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Configurar Integrações <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {currentStep === "integrations" && (
            <div>
              <IntegrationSetup onComplete={handleIntegrationsComplete} />
            </div>
          )}

          {currentStep === "complete" && (
            <Card className="max-w-2xl mx-auto p-8 border-zinc-800 bg-zinc-900/50">
              <div className="text-center">
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Tudo Pronto!
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Sua conta foi configurada com sucesso. Você já pode começar a criar e usar seus agentes de IA.
                </p>
                
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-8">
                  <h3 className="text-green-400 font-semibold mb-2">Próximos Passos:</h3>
                  <ul className="text-green-300 text-sm space-y-1 text-left">
                    <li>• Acesse seu dashboard para ver seu primeiro agente</li>
                    <li>• Configure mais agentes conforme sua necessidade</li>
                    <li>• Teste as integrações do WhatsApp</li>
                    <li>• Explore a base de conhecimento</li>
                  </ul>
                </div>
                
                <Button
                  onClick={goToDashboard}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  Ir para o Dashboard 🎯
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}