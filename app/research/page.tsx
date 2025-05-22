import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ResearchPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-normal mb-8">Pesquisa</h1>
          <p className="text-xl mb-8">
            Nossa missão é garantir que a inteligência artificial beneficie toda a humanidade. Realizamos pesquisas
            fundamentais em IA e publicamos a maioria de nossos trabalhos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
          <div className="border-t border-white/20 pt-6">
            <h2 className="text-2xl font-normal mb-4">Áreas de pesquisa</h2>
            <p className="text-white/70 mb-6">
              Nosso trabalho abrange desde pesquisa fundamental até aplicações práticas de IA, com foco em segurança,
              alinhamento e capacidades.
            </p>
            <Link href="/research/areas" className="text-sm underline hover:no-underline flex items-center">
              Explorar áreas de pesquisa
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h2 className="text-2xl font-normal mb-4">Publicações</h2>
            <p className="text-white/70 mb-6">
              Publicamos regularmente nossos resultados em conferências acadêmicas e em nosso blog, compartilhando
              conhecimento com a comunidade.
            </p>
            <Link href="/research/publications" className="text-sm underline hover:no-underline flex items-center">
              Ver publicações
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <h2 className="text-3xl font-normal mb-10">Publicações recentes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Publicação 1"
              className="aspect-square object-cover mb-4"
            />
            <h3 className="text-lg font-normal mb-2">Alinhamento de modelos de linguagem com feedback humano</h3>
            <p className="text-white/70 text-sm mb-4">
              Exploramos métodos para alinhar modelos de linguagem com intenções humanas através de técnicas de
              aprendizado por reforço.
            </p>
            <p className="text-white/50 text-sm mb-2">Maio 2023</p>
            <Link href="/research/publications/1" className="text-sm underline hover:no-underline">
              Ler publicação
            </Link>
          </div>

          <div>
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Publicação 2"
              className="aspect-square object-cover mb-4"
            />
            <h3 className="text-lg font-normal mb-2">Avaliação de riscos em sistemas de IA avançados</h3>
            <p className="text-white/70 text-sm mb-4">
              Desenvolvemos uma estrutura para avaliar e mitigar riscos em sistemas de IA cada vez mais capazes.
            </p>
            <p className="text-white/50 text-sm mb-2">Abril 2023</p>
            <Link href="/research/publications/2" className="text-sm underline hover:no-underline">
              Ler publicação
            </Link>
          </div>

          <div>
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Publicação 3"
              className="aspect-square object-cover mb-4"
            />
            <h3 className="text-lg font-normal mb-2">Melhorando a interpretabilidade de modelos de linguagem</h3>
            <p className="text-white/70 text-sm mb-4">
              Investigamos técnicas para tornar os modelos de linguagem mais interpretáveis e transparentes.
            </p>
            <p className="text-white/50 text-sm mb-2">Março 2023</p>
            <Link href="/research/publications/3" className="text-sm underline hover:no-underline">
              Ler publicação
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6">Equipe de pesquisa</h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-2xl font-normal mb-6 leading-tight">
              Nossa equipe de pesquisa é composta por cientistas e engenheiros de diversas áreas, trabalhando juntos
              para avançar o campo da IA.
            </p>
            <Link href="/research/team" className="text-sm underline hover:no-underline flex items-center">
              Conheça nossa equipe
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <h2 className="text-3xl font-normal mb-10">Colaborações</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-normal mb-4">Parcerias acadêmicas</h3>
            <p className="text-white/70 mb-6">
              Colaboramos com universidades e instituições de pesquisa em todo o mundo para avançar o conhecimento em
              IA.
            </p>
            <Link href="/research/collaborations/academic" className="text-sm underline hover:no-underline">
              Ver parcerias acadêmicas
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-normal mb-4">Programas de bolsas</h3>
            <p className="text-white/70 mb-6">
              Oferecemos bolsas para pesquisadores e estudantes interessados em trabalhar em problemas importantes de
              IA.
            </p>
            <Link href="/research/collaborations/fellowships" className="text-sm underline hover:no-underline">
              Ver programas de bolsas
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-normal mb-8">Interessado em se juntar à nossa equipe?</h2>
          <p className="text-xl mb-8 max-w-2xl">
            Estamos sempre procurando pesquisadores talentosos para ajudar a avançar nossa missão de criar IA segura e
            benéfica.
          </p>
          <Link
            href="/careers/research"
            className="border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors inline-flex items-center"
          >
            Ver vagas em pesquisa
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}
