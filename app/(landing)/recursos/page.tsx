import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Bot, MessageSquare, BarChart3, Zap, Shield, Globe, Smartphone } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Recursos - Agentes de Conversão',
  description: 'Descubra todas as funcionalidades avançadas da nossa plataforma de agentes conversacionais com IA.',
}

const features = [
  {
    icon: Bot,
    title: 'IA Conversacional Avançada',
    description: 'Agentes inteligentes que compreendem contexto e mantêm conversas naturais',
    benefits: [
      'Processamento de linguagem natural',
      'Memória de conversação',
      'Respostas contextualizadas',
      'Aprendizado contínuo'
    ]
  },
  {
    icon: MessageSquare,
    title: 'Múltiplos Canais',
    description: 'Integração nativa com WhatsApp, Telegram, Instagram e Facebook',
    benefits: [
      'WhatsApp Business API',
      'Telegram Bot',
      'Instagram Direct',
      'Facebook Messenger'
    ]
  },
  {
    icon: BarChart3,
    title: 'Analytics Avançado',
    description: 'Métricas detalhadas e insights sobre performance dos agentes',
    benefits: [
      'Taxa de conversão',
      'Tempo de resposta',
      'Satisfação do cliente',
      'ROI em tempo real'
    ]
  },
  {
    icon: Zap,
    title: 'Automação Inteligente',
    description: 'Fluxos automatizados que qualificam e convertem leads',
    benefits: [
      'Qualificação automática',
      'Agendamento inteligente',
      'Follow-up automático',
      'Nutrição de leads'
    ]
  },
  {
    icon: Shield,
    title: 'Segurança Enterprise',
    description: 'Proteção de dados e conformidade com LGPD',
    benefits: [
      'Criptografia end-to-end',
      'Conformidade LGPD',
      'Backup automático',
      'Auditoria completa'
    ]
  },
  {
    icon: Globe,
    title: 'API Robusta',
    description: 'Integração fácil com sistemas existentes',
    benefits: [
      'REST API completa',
      'Webhooks em tempo real',
      'SDKs oficiais',
      'Documentação detalhada'
    ]
  }
]

const integrations = [
  { name: 'CRM', desc: 'HubSpot, Pipedrive, Salesforce' },
  { name: 'E-commerce', desc: 'Shopify, WooCommerce, Magento' },
  { name: 'Marketing', desc: 'RD Station, Mailchimp, ActiveCampaign' },
  { name: 'Pagamentos', desc: 'PagSeguro, Mercado Pago, Stripe' },
  { name: 'Suporte', desc: 'Zendesk, Freshdesk, Intercom' },
  { name: 'Analytics', desc: 'Google Analytics, Hotjar, Mixpanel' }
]

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white">
                Agentes de Conversão
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sobre" className="text-gray-300 hover:text-white">
                Sobre
              </Link>
              <Link href="/precos" className="text-gray-300 hover:text-white">
                Preços
              </Link>
              <Link href="/recursos" className="text-white font-medium">
                Recursos
              </Link>
              <Link href="/contato" className="text-gray-300 hover:text-white">
                Contato
              </Link>
              <Button asChild>
                <Link href="/auth/login">Fazer Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
            Recursos Completos
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-6">
            Tudo que você precisa para
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> converter mais</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Nossa plataforma oferece todas as ferramentas necessárias para criar agentes conversacionais
            inteligentes que transformam visitantes em clientes.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                        <Icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-400">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Integre com suas ferramentas favoritas
            </h2>
            <p className="text-xl text-gray-300">
              Conecte-se facilmente com mais de 100 ferramentas populares
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
                  <p className="text-gray-400 text-sm">{integration.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Experimente todos esses recursos gratuitamente por 14 dias
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/auth/signup">Começar Gratuitamente</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300" asChild>
              <Link href="/contato">Falar com Especialista</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Agentes de Conversão. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}