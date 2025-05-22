import { MainLayout } from "@/components/layout/main-layout"
import Link from "next/link"
import { ArrowRight, MessageSquare, Database, Zap, Lock, BarChart3, Globe } from "lucide-react"

export default function AgentsFeaturesPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-normal mb-8">Recursos dos Agentes</h1>
          <p className="text-xl mb-8">
            Nossos agentes de IA são equipados com recursos avançados para fornecer experiências conversacionais
            excepcionais e impulsionar seus resultados de negócios.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal mb-4">Conversação natural</h2>
                <p className="text-white/70">
                  Nossos agentes são capazes de manter conversas naturais e fluidas, entendendo o contexto e respondendo
                  de forma coerente a perguntas complexas.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 mt-6">
              <h3 className="text-lg font-normal mb-4">Recursos de conversação</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    1
                  </div>
                  <span>Compreensão de contexto e histórico de conversas</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    2
                  </div>
                  <span>Capacidade de fazer perguntas de acompanhamento</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    3
                  </div>
                  <span>Respostas personalizadas baseadas no perfil do usuário</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    4
                  </div>
                  <span>Suporte a múltiplos idiomas</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal mb-4">Base de conhecimento personalizada</h2>
                <p className="text-white/70">
                  Alimente seus agentes com informações específicas do seu negócio, permitindo que eles respondam com
                  precisão sobre seus produtos, serviços e políticas.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 mt-6">
              <h3 className="text-lg font-normal mb-4">Recursos de conhecimento</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    1
                  </div>
                  <span>Upload de documentos (PDF, DOCX, TXT)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    2
                  </div>
                  <span>Integração com bases de dados existentes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    3
                  </div>
                  <span>Atualização automática de conhecimento</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    4
                  </div>
                  <span>Citações e referências às fontes originais</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal mb-4">Personalização avançada</h2>
                <p className="text-white/70">
                  Configure seus agentes para atender às necessidades específicas do seu negócio, desde o tom de voz até
                  as habilidades especializadas.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 mt-6">
              <h3 className="text-lg font-normal mb-4">Opções de personalização</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    1
                  </div>
                  <span>Ajuste de tom e estilo de comunicação</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    2
                  </div>
                  <span>Definição de instruções específicas</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    3
                  </div>
                  <span>Configuração de fluxos de conversação</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    4
                  </div>
                  <span>Personalização visual e de marca</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal mb-4">Segurança e privacidade</h2>
                <p className="text-white/70">
                  Nossos agentes são desenvolvidos com segurança em mente, garantindo a proteção dos dados e a
                  conformidade com regulamentações.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 mt-6">
              <h3 className="text-lg font-normal mb-4">Recursos de segurança</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    1
                  </div>
                  <span>Criptografia de dados em trânsito e em repouso</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    2
                  </div>
                  <span>Controle de acesso baseado em funções</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    3
                  </div>
                  <span>Conformidade com LGPD, GDPR e outras regulamentações</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    4
                  </div>
                  <span>Filtragem de conteúdo sensível e inapropriado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal mb-4">Analytics e insights</h2>
                <p className="text-white/70">
                  Obtenha insights valiosos sobre as interações dos usuários com seus agentes, permitindo melhorias
                  contínuas e tomadas de decisão baseadas em dados.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 mt-6">
              <h3 className="text-lg font-normal mb-4">Recursos de analytics</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    1
                  </div>
                  <span>Painéis de desempenho em tempo real</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    2
                  </div>
                  <span>Análise de sentimento e satisfação do usuário</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    3
                  </div>
                  <span>Identificação de tópicos e perguntas frequentes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    4
                  </div>
                  <span>Relatórios personalizáveis e exportáveis</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-normal mb-4">Integração multicanal</h2>
                <p className="text-white/70">
                  Implante seus agentes em múltiplos canais, desde seu site até plataformas de mensagens populares,
                  oferecendo uma experiência consistente em todos os pontos de contato.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 mt-6">
              <h3 className="text-lg font-normal mb-4">Canais suportados</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    1
                  </div>
                  <span>Sites e aplicativos web</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    2
                  </div>
                  <span>WhatsApp, Telegram e outras plataformas de mensagens</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    3
                  </div>
                  <span>Aplicativos móveis (iOS e Android)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                    4
                  </div>
                  <span>Integração com sistemas CRM e help desk</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-20 border-t border-white/20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-normal mb-8">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl">
            Crie seu primeiro agente hoje e descubra como a IA conversacional pode transformar seu negócio.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/agents/new"
              className="border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
            >
              Criar agente
            </Link>
            <Link
              href="/agents/examples"
              className="border border-white py-2 px-4 hover:bg-white hover:text-black transition-colors"
            >
              Ver exemplos
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
