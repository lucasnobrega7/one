import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight, Shield, AlertTriangle, Lock, Users, FileText, CheckCircle } from "lucide-react"

export default function SafetyPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-normal mb-8">Segurança</h1>
          <p className="text-xl mb-8">
            Nosso compromisso é desenvolver IA de forma segura e responsável, garantindo que nossos sistemas beneficiem
            a humanidade e minimizem riscos potenciais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <Shield className="h-6 w-6 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-normal">Abordagem de segurança</h3>
            </div>
            <p className="text-white/70 mb-6">
              Nossa abordagem de segurança é baseada em pesquisa rigorosa, testes extensivos e feedback contínuo.
            </p>
            <Link href="/safety/approach" className="text-sm underline hover:no-underline flex items-center">
              Saiba mais
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-normal">Mitigação de riscos</h3>
            </div>
            <p className="text-white/70 mb-6">
              Identificamos e mitigamos riscos potenciais em nossos sistemas de IA através de processos robustos.
            </p>
            <Link href="/safety/risk-mitigation" className="text-sm underline hover:no-underline flex items-center">
              Saiba mais
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <Lock className="h-6 w-6 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-normal">Segurança de dados</h3>
            </div>
            <p className="text-white/70 mb-6">
              Protegemos os dados de nossos usuários com as mais altas medidas de segurança e privacidade.
            </p>
            <Link href="/safety/data-security" className="text-sm underline hover:no-underline flex items-center">
              Saiba mais
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6">Princípios de segurança</h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-2xl font-normal mb-10 leading-tight">
              Nossos princípios de segurança orientam todas as nossas decisões e ações no desenvolvimento de sistemas de
              IA.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-normal mb-2">Segurança por design</h3>
                  <p className="text-white/70">
                    Incorporamos considerações de segurança desde o início do processo de desenvolvimento, não como uma
                    reflexão tardia.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-normal mb-2">Transparência e explicabilidade</h3>
                  <p className="text-white/70">
                    Nos esforçamos para tornar nossos sistemas de IA transparentes e explicáveis, permitindo que os
                    usuários entendam como as decisões são tomadas.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-normal mb-2">Robustez e confiabilidade</h3>
                  <p className="text-white/70">
                    Desenvolvemos sistemas que são robustos contra ataques e confiáveis em diversas condições de
                    operação.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-lg">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-normal mb-2">Responsabilidade compartilhada</h3>
                  <p className="text-white/70">
                    Reconhecemos que a segurança da IA é uma responsabilidade compartilhada entre desenvolvedores,
                    usuários e a sociedade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <h2 className="text-3xl font-normal mb-10">Recursos de segurança</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <Users className="h-6 w-6 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-normal">Governança de IA</h3>
            </div>
            <p className="text-white/70 mb-6">
              Nossa estrutura de governança de IA garante supervisão e responsabilidade em todas as fases de
              desenvolvimento.
            </p>
            <Link href="/safety/governance" className="text-sm underline hover:no-underline">
              Saiba mais sobre governança
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <FileText className="h-6 w-6 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-normal">Políticas e diretrizes</h3>
            </div>
            <p className="text-white/70 mb-6">
              Nossas políticas e diretrizes estabelecem padrões claros para o desenvolvimento e uso responsável de IA.
            </p>
            <Link href="/safety/policies" className="text-sm underline hover:no-underline">
              Ver políticas e diretrizes
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-normal">Avaliação de segurança</h3>
            </div>
            <p className="text-white/70 mb-6">
              Realizamos avaliações rigorosas de segurança em nossos sistemas antes de seu lançamento.
            </p>
            <Link href="/safety/assessment" className="text-sm underline hover:no-underline">
              Saiba mais sobre avaliações
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start mb-4">
              <Shield className="h-6 w-6 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-normal">Programa de bug bounty</h3>
            </div>
            <p className="text-white/70 mb-6">
              Nosso programa de bug bounty incentiva a comunidade a identificar e relatar vulnerabilidades de segurança.
            </p>
            <Link href="/safety/bug-bounty" className="text-sm underline hover:no-underline">
              Participar do programa
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6">Relatórios de segurança</h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-2xl font-normal mb-6 leading-tight">
              Publicamos regularmente relatórios detalhando nossos esforços de segurança e as lições aprendidas.
            </p>
            <div className="space-y-6">
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-lg font-normal mb-2">Relatório anual de segurança 2023</h3>
                <p className="text-white/70 mb-2">
                  Uma visão abrangente de nossos esforços de segurança durante o ano de 2023.
                </p>
                <Link href="/safety/reports/2023" className="text-sm underline hover:no-underline">
                  Ler relatório
                </Link>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-lg font-normal mb-2">Avaliação de riscos de modelos de linguagem</h3>
                <p className="text-white/70 mb-2">
                  Uma análise detalhada dos riscos potenciais associados aos modelos de linguagem avançados.
                </p>
                <Link href="/safety/reports/language-models" className="text-sm underline hover:no-underline">
                  Ler relatório
                </Link>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-lg font-normal mb-2">Estudo de caso: Mitigação de viés em IA</h3>
                <p className="text-white/70 mb-2">
                  Um estudo de caso sobre como identificamos e mitigamos viés em nossos sistemas de IA.
                </p>
                <Link href="/safety/reports/bias-mitigation" className="text-sm underline hover:no-underline">
                  Ler estudo de caso
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-normal mb-8">Colabore com nossa missão de segurança</h2>
          <p className="text-xl mb-8 max-w-2xl">
            A segurança da IA é um esforço coletivo. Junte-se a nós para garantir que a IA seja desenvolvida de forma
            segura e benéfica para todos.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/safety/collaborate"
              className="border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
            >
              Como colaborar
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
