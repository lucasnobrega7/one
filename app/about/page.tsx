import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-normal mb-8">Transformando negócios com IA conversacional</h1>
          <p className="text-xl mb-8 text-gray-300">
            A Agentes de Conversão é líder em criação de assistentes virtuais inteligentes que convertem visitantes em clientes. 
            Desenvolvemos agentes conversacionais que entendem contexto, personalizam experiências e maximizam resultados.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4">50M+</h3>
            <p className="text-gray-300">Conversas processadas</p>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4">15,000+</h3>
            <p className="text-gray-300">Empresas atendidas</p>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4">45%</h3>
            <p className="text-gray-300">Aumento médio em conversões</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-gray-800/50">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6 text-white">Nossa missão</h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-2xl font-normal mb-6 leading-tight text-white">
              Democratizar o poder da IA conversacional para empresas de todos os tamanhos. 
              Criamos agentes inteligentes que transformam a forma como negócios se conectam com seus clientes.
            </p>
            <p className="text-gray-300 mb-6">
              Acreditamos que toda empresa deveria ter acesso a tecnologia de ponta para automatizar vendas, 
              suporte e marketing. Nossos agentes conversacionais não apenas respondem perguntas - eles entendem 
              intenções, personalizam experiências e guiam clientes através de jornadas de compra complexas.
            </p>
            <p className="text-gray-300">
              Com tecnologia baseada nos modelos mais avançados do mundo (GPT-4o, Claude 3.5), oferecemos 
              soluções que combinam inteligência artificial de última geração com foco absoluto em resultados comerciais.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-gray-800/50">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6 text-white">Nossa jornada</h2>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-normal mb-2 text-white">2022</h3>
                <p className="text-gray-300">
                  Fundamos a Agentes de Conversão com a visão de tornar chatbots verdadeiramente inteligentes. 
                  Começamos desenvolvendo os primeiros protótipos focados em conversão de vendas.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-2 text-white">2023</h3>
                <p className="text-gray-300">
                  Lançamos nossa plataforma beta e conseguimos nossos primeiros clientes. Resultados impressionantes: 
                  aumentos de 35-60% nas taxas de conversão para e-commerces e empresas SaaS.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-2 text-white">Início 2024</h3>
                <p className="text-gray-300">
                  Integramos GPT-4o e Claude 3.5 à nossa plataforma. Lançamos recursos avançados como análise de 
                  sentimentos em tempo real e personalização de diálogos baseada em comportamento do usuário.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-2 text-white">Meio 2024</h3>
                <p className="text-gray-300">
                  Atingimos 1.000+ empresas ativas na plataforma. Lançamos integrações nativas com WhatsApp, 
                  Instagram, Telegram e principais plataformas de e-commerce.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-2 text-white">Hoje</h3>
                <p className="text-gray-300">
                  Lideramos o mercado brasileiro de agentes conversacionais para vendas. Expandindo para 
                  América Latina com foco em democratizar IA conversacional para PMEs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-gray-800/50">
        <h2 className="text-3xl font-normal mb-10 text-white">Especialistas em IA conversacional</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-gray-900/30 p-6 rounded-xl border border-gray-700/50">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 flex items-center justify-center text-white font-bold text-lg">
              LN
            </div>
            <h3 className="text-lg font-normal mb-1 text-white">Lucas Nóbrega</h3>
            <p className="text-gray-400 text-sm mb-2">CEO e Co-fundador</p>
            <p className="text-gray-300 text-sm">
              Ex-Head of Conversational AI no Nubank. Especialista em NLP e sistemas de diálogo. 
              Liderou a criação de chatbots que atendem milhões de usuários mensalmente.
            </p>
          </div>

          <div className="bg-gray-900/30 p-6 rounded-xl border border-gray-700/50">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4 flex items-center justify-center text-white font-bold text-lg">
              RM
            </div>
            <h3 className="text-lg font-normal mb-1 text-white">Rafael Moura</h3>
            <p className="text-gray-400 text-sm mb-2">CTO e Co-fundador</p>
            <p className="text-gray-300 text-sm">
              Arquiteto de sistemas de IA conversacional. Ex-Google AI. PhD em Machine Learning pela USP. 
              Especialista em fine-tuning de LLMs para casos de uso comerciais.
            </p>
          </div>

          <div className="bg-gray-900/30 p-6 rounded-xl border border-gray-700/50">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mb-4 flex items-center justify-center text-white font-bold text-lg">
              AC
            </div>
            <h3 className="text-lg font-normal mb-1 text-white">Ana Carvalho</h3>
            <p className="text-gray-400 text-sm mb-2">Diretora de Produto</p>
            <p className="text-gray-300 text-sm">
              Product Manager com foco em IA conversacional. Ex-Microsoft Bot Framework. 
              Especialista em UX para interfaces conversacionais e otimização de conversões.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/careers"
            className="inline-flex items-center border border-gray-600 text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-800/30 hover:border-gray-500 hover:text-white transition-all"
          >
            Junte-se ao time
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6">Nossos valores</h2>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-8">
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-xl font-normal mb-2">Segurança em primeiro lugar</h3>
                <p className="text-white/70">
                  Priorizamos a segurança em tudo o que fazemos, desde a pesquisa até a implantação de nossos sistemas.
                </p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-xl font-normal mb-2">Transparência</h3>
                <p className="text-white/70">
                  Acreditamos na transparência sobre nossas capacidades, limitações e processos de tomada de decisão.
                </p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-xl font-normal mb-2">Colaboração</h3>
                <p className="text-white/70">
                  Valorizamos a colaboração com a comunidade científica, outras organizações e a sociedade civil.
                </p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-xl font-normal mb-2">Impacto positivo</h3>
                <p className="text-white/70">
                  Nos esforçamos para garantir que nossa tecnologia tenha um impacto positivo no mundo.
                </p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-xl font-normal mb-2">Diversidade e inclusão</h3>
                <p className="text-white/70">
                  Acreditamos que a diversidade de perspectivas é essencial para desenvolver IA que beneficie a todos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-normal mb-8">Junte-se a nós</h2>
          <p className="text-xl mb-8 max-w-2xl">
            Estamos sempre procurando pessoas talentosas e apaixonadas para se juntar à nossa equipe e ajudar a moldar o
            futuro da IA.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/careers"
              className="border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
            >
              Ver vagas abertas
            </Link>
            <Link
              href="/contact"
              className="border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
            >
              Entre em contato
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
