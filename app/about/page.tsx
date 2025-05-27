import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full border-b border-[--openai-gray-200] bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <Logo variant="default" size="md" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-4xl">
          <h1 className="sohne-heading text-5xl md:text-6xl font-normal mb-8 text-[--openai-gray-900] leading-tight">
            Transformando negócios com IA conversacional
          </h1>
          <p className="text-xl mb-12 text-[--openai-gray-600] leading-relaxed max-w-3xl">
            A Agentes de Conversão é líder em criação de assistentes virtuais inteligentes que convertem visitantes em clientes. 
            Desenvolvemos agentes conversacionais que entendem contexto, personalizam experiências e maximizam resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="openai-card-light p-8 text-center">
            <h3 className="sohne-heading text-3xl font-semibold text-[--openai-gray-900] mb-3">50M+</h3>
            <p className="text-[--openai-gray-600]">Conversas processadas</p>
          </div>
          <div className="openai-card-light p-8 text-center">
            <h3 className="sohne-heading text-3xl font-semibold text-[--openai-gray-900] mb-3">15,000+</h3>
            <p className="text-[--openai-gray-600]">Empresas atendidas</p>
          </div>
          <div className="openai-card-light p-8 text-center">
            <h3 className="sohne-heading text-3xl font-semibold text-[--openai-gray-900] mb-3">45%</h3>
            <p className="text-[--openai-gray-600]">Aumento médio em conversões</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24 border-t border-[--openai-gray-200]">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="sohne-heading text-4xl font-normal text-[--openai-gray-900] mb-6">Nossa missão</h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-2xl font-normal mb-8 leading-relaxed text-[--openai-gray-900]">
              Democratizar o poder da IA conversacional para empresas de todos os tamanhos. 
              Criamos agentes inteligentes que transformam a forma como negócios se conectam com seus clientes.
            </p>
            <p className="text-[--openai-gray-600] mb-6 leading-relaxed">
              Acreditamos que toda empresa deveria ter acesso a tecnologia de ponta para automatizar vendas, 
              suporte e marketing. Nossos agentes conversacionais não apenas respondem perguntas - eles entendem 
              intenções, personalizam experiências e guiam clientes através de jornadas de compra complexas.
            </p>
            <p className="text-[--openai-gray-600] leading-relaxed">
              Com tecnologia baseada nos modelos mais avançados do mundo (GPT-4o, Claude 3.5), oferecemos 
              soluções que combinam inteligência artificial de última geração com foco absoluto em resultados comerciais.
            </p>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24 border-t border-[--openai-gray-200]">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="sohne-heading text-4xl font-normal text-[--openai-gray-900] mb-6">Nossa jornada</h2>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-10">
              <div className="border-l-2 border-[--openai-gray-200] pl-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">2022</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Fundamos a Agentes de Conversão com a visão de tornar chatbots verdadeiramente inteligentes. 
                  Começamos desenvolvendo os primeiros protótipos focados em conversão de vendas.
                </p>
              </div>

              <div className="border-l-2 border-[--openai-gray-200] pl-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">2023</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Lançamos nossa plataforma beta e conseguimos nossos primeiros clientes. Resultados impressionantes: 
                  aumentos de 35-60% nas taxas de conversão para e-commerces e empresas SaaS.
                </p>
              </div>

              <div className="border-l-2 border-[--openai-gray-200] pl-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">Início 2024</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Integramos GPT-4o e Claude 3.5 à nossa plataforma. Lançamos recursos avançados como análise de 
                  sentimentos em tempo real e personalização de diálogos baseada em comportamento do usuário.
                </p>
              </div>

              <div className="border-l-2 border-[--openai-gray-200] pl-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">Meio 2024</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Atingimos 1.000+ empresas ativas na plataforma. Lançamos integrações nativas com WhatsApp, 
                  Instagram, Telegram e principais plataformas de e-commerce.
                </p>
              </div>

              <div className="border-l-2 border-[--openai-blue] pl-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">Hoje</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Lideramos o mercado brasileiro de agentes conversacionais para vendas. Expandindo para 
                  América Latina com foco em democratizar IA conversacional para PMEs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24 border-t border-[--openai-gray-200]">
        <h2 className="sohne-heading text-3xl font-normal mb-12 text-[--openai-gray-900]">Especialistas em IA conversacional</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="openai-card-light p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[--openai-blue] to-purple-600 rounded-full mb-6 flex items-center justify-center text-white font-bold text-lg">
              LN
            </div>
            <h3 className="text-lg font-medium mb-2 text-[--openai-gray-900]">Lucas Nóbrega</h3>
            <p className="text-[--openai-gray-600] text-sm mb-4">CEO e Co-fundador</p>
            <p className="text-[--openai-gray-600] text-sm leading-relaxed">
              Ex-Head of Conversational AI no Nubank. Especialista em NLP e sistemas de diálogo. 
              Liderou a criação de chatbots que atendem milhões de usuários mensalmente.
            </p>
          </div>

          <div className="openai-card-light p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6 flex items-center justify-center text-white font-bold text-lg">
              RM
            </div>
            <h3 className="text-lg font-medium mb-2 text-[--openai-gray-900]">Rafael Moura</h3>
            <p className="text-[--openai-gray-600] text-sm mb-4">CTO e Co-fundador</p>
            <p className="text-[--openai-gray-600] text-sm leading-relaxed">
              Arquiteto de sistemas de IA conversacional. Ex-Google AI. PhD em Machine Learning pela USP. 
              Especialista em fine-tuning de LLMs para casos de uso comerciais.
            </p>
          </div>

          <div className="openai-card-light p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mb-6 flex items-center justify-center text-white font-bold text-lg">
              AC
            </div>
            <h3 className="text-lg font-medium mb-2 text-[--openai-gray-900]">Ana Carvalho</h3>
            <p className="text-[--openai-gray-600] text-sm mb-4">Diretora de Produto</p>
            <p className="text-[--openai-gray-600] text-sm leading-relaxed">
              Product Manager com foco em IA conversacional. Ex-Microsoft Bot Framework. 
              Especialista em UX para interfaces conversacionais e otimização de conversões.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/careers"
            className="inline-flex items-center border border-[--openai-gray-300] text-[--openai-gray-700] py-3 px-6 rounded-lg hover:bg-[--openai-gray-50] hover:border-[--openai-gray-400] transition-all"
          >
            Junte-se ao time
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24 border-t border-[--openai-gray-200]">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="sohne-heading text-4xl font-normal text-[--openai-gray-900] mb-6">Nossos valores</h2>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-8">
              <div className="border-t border-[--openai-gray-200] pt-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">Segurança em primeiro lugar</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Priorizamos a segurança em tudo o que fazemos, desde a pesquisa até a implantação de nossos sistemas.
                </p>
              </div>

              <div className="border-t border-[--openai-gray-200] pt-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">Transparência</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Acreditamos na transparência sobre nossas capacidades, limitações e processos de tomada de decisão.
                </p>
              </div>

              <div className="border-t border-[--openai-gray-200] pt-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">Colaboração</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Valorizamos a colaboração com a comunidade científica, outras organizações e a sociedade civil.
                </p>
              </div>

              <div className="border-t border-[--openai-gray-200] pt-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">Impacto positivo</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Nos esforçamos para garantir que nossa tecnologia tenha um impacto positivo no mundo.
                </p>
              </div>

              <div className="border-t border-[--openai-gray-200] pt-6">
                <h3 className="text-xl font-medium mb-3 text-[--openai-gray-900]">Diversidade e inclusão</h3>
                <p className="text-[--openai-gray-600] leading-relaxed">
                  Acreditamos que a diversidade de perspectivas é essencial para desenvolver IA que beneficie a todos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24 border-t border-[--openai-gray-200]">
        <div className="flex flex-col items-center text-center">
          <h2 className="sohne-heading text-4xl font-normal mb-8 text-[--openai-gray-900]">Junte-se a nós</h2>
          <p className="text-xl mb-12 max-w-2xl text-[--openai-gray-600] leading-relaxed">
            Estamos sempre procurando pessoas talentosas e apaixonadas para se juntar à nossa equipe e ajudar a moldar o
            futuro da IA.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/careers"
              className="btn-openai-primary-light"
            >
              Ver vagas abertas
            </Link>
            <Link
              href="/contact"
              className="border border-[--openai-gray-300] text-[--openai-gray-700] py-3 px-6 rounded-lg hover:bg-[--openai-gray-50] hover:border-[--openai-gray-400] transition-all"
            >
              Entre em contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
