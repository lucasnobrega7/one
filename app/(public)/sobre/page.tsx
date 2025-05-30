import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/sections/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Sobre - Agentes de Conversão',
  description: 'Conheça a história e missão dos Agentes de Conversão, a plataforma que revoluciona a interação com clientes através de IA.',
}

export default function SobrePage() {
  return (
    <main className="relative">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sobre os <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Agentes de Conversão
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transformamos a maneira como empresas se conectam com seus clientes através de agentes conversacionais inteligentes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Democratizar o acesso à inteligência artificial conversacional, permitindo que empresas de todos os tamanhos 
                  ofereçam atendimento excepcional e aumentem suas conversões através de agentes inteligentes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Nossa Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Ser a plataforma líder em agentes conversacionais no Brasil, revolucionando a experiência do cliente 
                  e impulsionando o crescimento de negócios através da automação inteligente.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Por que escolher os Agentes de Conversão?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">IA Avançada</h3>
                <p className="text-gray-300 text-sm">
                  Utilizamos os modelos de IA mais avançados do mercado para conversas naturais e eficazes.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Implementação Rápida</h3>
                <p className="text-gray-300 text-sm">
                  Configure e implemente seus agentes em minutos, não em semanas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">ROI Comprovado</h3>
                <p className="text-gray-300 text-sm">
                  Nossos clientes veem aumento médio de 40% nas conversões nos primeiros 30 dias.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Pronto para transformar seu atendimento?</h2>
            <p className="text-gray-300 mb-8">
              Junte-se a centenas de empresas que já revolucionaram sua comunicação com clientes.
            </p>
            <a 
              href="/signup" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Começar Gratuitamente
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}