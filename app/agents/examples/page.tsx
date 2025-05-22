import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight, MessageSquare } from "lucide-react"

export default function AgentsExamplesPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-normal mb-8">Exemplos de Agentes</h1>
          <p className="text-xl mb-8">
            Explore exemplos de agentes conversacionais criados com nossa plataforma e veja como eles podem ser
            aplicados em diferentes setores e casos de uso.
          </p>
          <Link
            href="/agents/new"
            className="inline-flex items-center border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
          >
            Criar seu agente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <h2 className="text-3xl font-normal mb-10">Agentes por setor</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-normal mb-4">E-commerce</h3>
            <p className="text-white/70 mb-6">
              Agentes que ajudam clientes a encontrar produtos, responder dúvidas e finalizar compras.
            </p>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Assistente de Compras</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Ajuda os clientes a encontrar produtos com base em suas preferências e necessidades.
                </p>
                <Link href="/agents/examples/shopping-assistant" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>

              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Suporte Pós-Venda</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Responde dúvidas sobre pedidos, entregas e políticas de devolução.
                </p>
                <Link href="/agents/examples/post-sale-support" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-normal mb-4">Finanças</h3>
            <p className="text-white/70 mb-6">
              Agentes que fornecem orientação financeira, suporte ao cliente e informações sobre produtos financeiros.
            </p>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Consultor Financeiro</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Oferece orientação sobre investimentos, poupança e planejamento financeiro.
                </p>
                <Link href="/agents/examples/financial-advisor" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>

              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Assistente Bancário</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Ajuda com operações bancárias, consultas de saldo e transferências.
                </p>
                <Link href="/agents/examples/banking-assistant" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-normal mb-4">Saúde</h3>
            <p className="text-white/70 mb-6">
              Agentes que fornecem informações sobre saúde, agendam consultas e oferecem suporte a pacientes.
            </p>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Assistente de Agendamento</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Ajuda pacientes a agendar, reagendar ou cancelar consultas médicas.
                </p>
                <Link href="/agents/examples/appointment-assistant" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>

              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Informações de Saúde</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Fornece informações sobre condições médicas, medicamentos e hábitos saudáveis.
                </p>
                <Link href="/agents/examples/health-information" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <h2 className="text-3xl font-normal mb-10">Agentes por função</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-normal mb-4">Vendas</h3>
            <p className="text-white/70 mb-6">
              Agentes que qualificam leads, respondem a perguntas sobre produtos e ajudam a fechar vendas.
            </p>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Qualificador de Leads</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Qualifica leads com base em critérios predefinidos e encaminha para a equipe de vendas.
                </p>
                <Link href="/agents/examples/lead-qualifier" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>

              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Especialista em Produtos</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Fornece informações detalhadas sobre produtos e ajuda na comparação de opções.
                </p>
                <Link href="/agents/examples/product-specialist" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-normal mb-4">Suporte ao Cliente</h3>
            <p className="text-white/70 mb-6">
              Agentes que resolvem problemas, respondem a perguntas frequentes e melhoram a experiência do cliente.
            </p>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Solucionador de Problemas</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Ajuda os clientes a resolver problemas técnicos e operacionais.
                </p>
                <Link href="/agents/examples/troubleshooter" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>

              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">FAQ Interativo</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Responde a perguntas frequentes de forma conversacional e contextual.
                </p>
                <Link href="/agents/examples/interactive-faq" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-normal mb-4">RH e Recrutamento</h3>
            <p className="text-white/70 mb-6">
              Agentes que auxiliam em processos de recrutamento, onboarding e suporte a colaboradores.
            </p>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Assistente de Recrutamento</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Responde a perguntas sobre vagas e auxilia candidatos no processo seletivo.
                </p>
                <Link href="/agents/examples/recruitment-assistant" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>

              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <h4 className="text-sm font-medium">Onboarding de Funcionários</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Guia novos funcionários durante o processo de integração à empresa.
                </p>
                <Link href="/agents/examples/employee-onboarding" className="text-xs underline hover:no-underline">
                  Ver demonstração
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-normal mb-6">Casos de sucesso</h2>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-8">
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-xl font-normal mb-2">E-commerce de moda aumenta conversão em 35%</h3>
                <p className="text-white/70 mb-4">
                  Uma loja online de moda implementou um agente de recomendação de produtos que ajuda os clientes a
                  encontrar roupas com base em suas preferências, resultando em um aumento de 35% na taxa de conversão.
                </p>
                <Link href="/case-studies/fashion-ecommerce" className="text-sm underline hover:no-underline">
                  Ler caso completo
                </Link>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="text-xl font-normal mb-2">Banco reduz tempo de atendimento em 60%</h3>
                <p className="text-white/70 mb-4">
                  Um banco implementou um agente de suporte ao cliente que resolve 80% das consultas sem intervenção
                  humana, reduzindo o tempo médio de atendimento em 60%.
                </p>
                <Link href="/case-studies/bank-support" className="text-sm underline hover:no-underline">
                  Ler caso completo
                </Link>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="text-xl font-normal mb-2">Empresa de software qualifica 3x mais leads</h3>
                <p className="text-white/70 mb-4">
                  Uma empresa de software B2B implementou um agente de qualificação de leads que triplicou o número de
                  leads qualificados encaminhados para a equipe de vendas.
                </p>
                <Link href="/case-studies/software-leads" className="text-sm underline hover:no-underline">
                  Ler caso completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-normal mb-8">Crie seu próprio agente</h2>
          <p className="text-xl mb-8 max-w-2xl">
            Inspire-se nos exemplos e crie um agente personalizado para atender às necessidades específicas do seu
            negócio.
          </p>
          <Link
            href="/agents/new"
            className="border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
          >
            Começar agora
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}
