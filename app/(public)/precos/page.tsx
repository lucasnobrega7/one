import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/sections/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Preços - Agentes de Conversão',
  description: 'Conheça nossos planos flexíveis e escolha o melhor para o seu negócio. Comece gratuitamente!',
}

export default function PrecosPage() {
  const plans = [
    {
      name: 'Starter',
      price: 'Gratuito',
      description: 'Perfeito para começar',
      popular: false,
      features: [
        '1 agente ativo',
        'Até 100 conversas/mês',
        'Integrações básicas',
        'Suporte por email',
        'Analytics básico',
        'Base de conhecimento (10MB)'
      ],
      cta: 'Começar Grátis',
      href: '/signup'
    },
    {
      name: 'Profissional',
      price: 'R$ 97',
      period: '/mês',
      description: 'Para empresas em crescimento',
      popular: true,
      features: [
        '5 agentes ativos',
        'Até 2.000 conversas/mês',
        'Todas as integrações',
        'Suporte prioritário',
        'Analytics avançado',
        'Base de conhecimento (500MB)',
        'Fluxos personalizados',
        'WhatsApp Business API',
        'Relatórios personalizados'
      ],
      cta: 'Teste Grátis por 14 dias',
      href: '/signup?plan=pro'
    },
    {
      name: 'Enterprise',
      price: 'R$ 297',
      period: '/mês',
      description: 'Para grandes empresas',
      popular: false,
      features: [
        'Agentes ilimitados',
        'Conversas ilimitadas',
        'Integrações customizadas',
        'Suporte dedicado',
        'Analytics premium',
        'Base de conhecimento ilimitada',
        'API completa',
        'Múltiplas organizações',
        'SLA garantido',
        'Treinamento especializado',
        'Onboarding dedicado'
      ],
      cta: 'Falar com Vendas',
      href: '/contato?plan=enterprise'
    }
  ]

  return (
    <main className="relative">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Planos que <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Escalam com Você
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comece gratuitamente e cresça conforme sua necessidade. Sem surpresas, sem taxas ocultas.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-gray-900/50 border-gray-700 ${plan.popular ? 'border-purple-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
                  </div>
                  <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <span className="text-green-400 mr-3">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg' 
                      : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    asChild
                  >
                    <a href={plan.href}>{plan.cta}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Perguntas Frequentes</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Sim, você pode cancelar ou alterar seu plano a qualquer momento. Não há multas ou taxas de cancelamento.
                </p>
                
                <h3 className="text-lg font-semibold text-white mb-2">Como funciona o período de teste?</h3>
                <p className="text-gray-300 text-sm">
                  Oferecemos 14 dias gratuitos nos planos pagos. Durante este período, você tem acesso total a todos os recursos.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">E se eu exceder os limites?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Enviamos notificações quando você se aproxima dos limites. Você pode fazer upgrade a qualquer momento.
                </p>
                
                <h3 className="text-lg font-semibold text-white mb-2">Preciso de conhecimento técnico?</h3>
                <p className="text-gray-300 text-sm">
                  Não! Nossa plataforma foi projetada para ser intuitiva. Oferecemos suporte e treinamento para todos os planos.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ainda tem dúvidas?</h2>
            <p className="text-gray-300 mb-8">
              Nossa equipe está pronta para ajudar você a escolher o melhor plano para seu negócio.
            </p>
            <a 
              href="/contato" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Falar com Especialista
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}