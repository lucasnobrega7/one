import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-normal mb-8">Sobre nós</h1>
          <p className="text-xl mb-8">
            A Agentes de Conversão é uma empresa de pesquisa e implantação de IA com a missão de garantir que a
            inteligência artificial beneficie toda a humanidade.
          </p>
        </div>

        <div className="mt-16">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OpenAI_Website_Clone__Community_-N4UMmInBmfKvnutkYNKNuVKdKNEAz6.png"
            alt="Equipe da Agentes de Conversão"
            className="w-full h-auto object-cover max-h-[600px]"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6">Nossa missão</h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-2xl font-normal mb-6 leading-tight">
              Nossa missão é garantir que a inteligência artificial avançada beneficie toda a humanidade. Estamos
              comprometidos em construir IA segura, benéfica e acessível.
            </p>
            <p className="text-white/70 mb-6">
              Acreditamos que a IA tem o potencial de resolver alguns dos problemas mais desafiadores da humanidade,
              desde mudanças climáticas até cuidados de saúde. No entanto, reconhecemos que essa tecnologia poderosa
              também apresenta riscos significativos.
            </p>
            <p className="text-white/70">
              É por isso que nos dedicamos a pesquisar e desenvolver IA de forma responsável, priorizando a segurança e
              o benefício público em todas as nossas decisões.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6">Nossa história</h2>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-normal mb-2">2020</h3>
                <p className="text-white/70">
                  A Agentes de Conversão foi fundada por um grupo de pesquisadores e engenheiros com a visão de
                  desenvolver IA avançada que pudesse ajudar a resolver problemas complexos.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-2">2021</h3>
                <p className="text-white/70">
                  Lançamos nossa primeira versão do modelo de linguagem e começamos a construir nossa plataforma de
                  agentes conversacionais.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-2">2022</h3>
                <p className="text-white/70">
                  Expandimos nossa equipe e estabelecemos parcerias com universidades e organizações para avançar nossa
                  pesquisa em IA segura e alinhada.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-2">2023</h3>
                <p className="text-white/70">
                  Lançamos nossa API pública e expandimos nossos serviços para empresas e desenvolvedores em todo o
                  mundo.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal mb-2">Hoje</h3>
                <p className="text-white/70">
                  Continuamos a inovar e expandir nossas capacidades, sempre com o foco em desenvolver IA segura e
                  benéfica para todos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <h2 className="text-3xl font-normal mb-10">Nossa equipe</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Membro da equipe 1"
              className="aspect-square object-cover mb-4"
            />
            <h3 className="text-lg font-normal mb-1">Ana Silva</h3>
            <p className="text-white/70 text-sm mb-2">CEO e Co-fundadora</p>
            <p className="text-white/70 text-sm">
              Ana lidera nossa visão estratégica e operações, com mais de 15 anos de experiência em IA e tecnologia.
              Antes de fundar a Agentes de Conversão, ela liderou equipes de pesquisa em grandes empresas de tecnologia.
            </p>
          </div>

          <div>
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Membro da equipe 2"
              className="aspect-square object-cover mb-4"
            />
            <h3 className="text-lg font-normal mb-1">Carlos Mendes</h3>
            <p className="text-white/70 text-sm mb-2">CTO e Co-fundador</p>
            <p className="text-white/70 text-sm">
              Carlos lidera nossa equipe de engenharia e pesquisa, com foco em desenvolver modelos de IA seguros e
              eficientes. Ele tem PhD em Aprendizado de Máquina.
            </p>
          </div>

          <div>
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Membro da equipe 3"
              className="aspect-square object-cover mb-4"
            />
            <h3 className="text-lg font-normal mb-1">Mariana Costa</h3>
            <p className="text-white/70 text-sm mb-2">Diretora de Pesquisa</p>
            <p className="text-white/70 text-sm">
              Mariana lidera nossas iniciativas de pesquisa em segurança e alinhamento de IA. Ela publicou dezenas de
              artigos em conferências internacionais.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/team"
            className="inline-flex items-center border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
          >
            Ver equipe completa
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
