export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal mb-4">
            Política de <span className="gradient-text-langflow">Privacidade</span>
          </h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              A Agentes de Conversão valoriza e respeita sua privacidade. Esta política 
              descreve como coletamos, usamos, armazenamos e protegemos suas informações 
              pessoais quando você usa nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
            
            <h3 className="text-lg font-medium mb-3">2.1 Informações Fornecidas por Você</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Dados de registro (nome, email, senha)</li>
              <li>Informações de pagamento (via processadores seguros)</li>
              <li>Conteúdo que você cria (agentes, conversas, documentos)</li>
              <li>Comunicações conosco (suporte, feedback)</li>
            </ul>

            <h3 className="text-lg font-medium mb-3">2.2 Informações Coletadas Automaticamente</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Logs de uso e atividade na plataforma</li>
              <li>Endereço IP e informações do dispositivo</li>
              <li>Cookies e tecnologias similares</li>
              <li>Métricas de performance dos agentes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Como Usamos suas Informações</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar comunicações importantes sobre sua conta</li>
              <li>Oferecer suporte técnico e atendimento ao cliente</li>
              <li>Desenvolver novos recursos e funcionalidades</li>
              <li>Cumprir obrigações legais e regulamentares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Não vendemos suas informações pessoais.</strong> Podemos compartilhar 
              informações apenas nas seguintes situações:
            </p>
            
            <h3 className="text-lg font-medium mb-3">4.1 Provedores de Serviço</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Terceiros que nos ajudam a operar nossa plataforma:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Processadores de pagamento (Stripe, PayPal)</li>
              <li>Provedores de infraestrutura (AWS, Railway)</li>
              <li>Ferramentas de analytics (respeitando sua privacidade)</li>
              <li>Serviços de email e comunicação</li>
            </ul>

            <h3 className="text-lg font-medium mb-3">4.2 Requisitos Legais</h3>
            <p className="text-muted-foreground leading-relaxed">
              Quando exigido por lei, ordem judicial ou para proteger direitos e segurança.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Implementamos medidas técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Criptografia em trânsito e em repouso (AES-256)</li>
              <li>Autenticação de dois fatores disponível</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares e seguros</li>
              <li>Acesso restrito baseado em função</li>
              <li>Auditoria regular de sistemas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você tem os seguintes direitos sobre suas informações pessoais:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2">🔍 Acesso</h4>
                <p className="text-sm text-muted-foreground">
                  Solicitar cópia de suas informações pessoais
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2">✏️ Correção</h4>
                <p className="text-sm text-muted-foreground">
                  Corrigir informações incorretas ou desatualizadas
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2">🗑️ Exclusão</h4>
                <p className="text-sm text-muted-foreground">
                  Solicitar exclusão de suas informações pessoais
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2">📦 Portabilidade</h4>
                <p className="text-sm text-muted-foreground">
                  Exportar seus dados em formato estruturado
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Usamos cookies para melhorar sua experiência:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Essenciais:</strong> Necessários para funcionalidade básica</li>
              <li><strong>Performance:</strong> Ajudam a melhorar nossos serviços</li>
              <li><strong>Funcionais:</strong> Lembram suas preferências</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Você pode gerenciar cookies nas configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Retenção de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos suas informações pelo tempo necessário para fornecer nossos serviços 
              e cumprir obrigações legais. Dados de contas inativas podem ser removidos após 
              2 anos de inatividade, com notificação prévia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Transferências Internacionais</h2>
            <p className="text-muted-foreground leading-relaxed">
              Seus dados podem ser processados em servidores localizados no Brasil e outros 
              países. Garantimos que todas as transferências atendem aos padrões de proteção 
              de dados aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Menores de Idade</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nossos serviços não são destinados a menores de 18 anos. Não coletamos 
              intencionalmente informações de menores de idade. Se identificarmos tais 
              dados, os removeremos prontamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta política periodicamente. Mudanças significativas serão 
              notificadas por email ou através da plataforma com pelo menos 30 dias de 
              antecedência.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contato</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para questões sobre privacidade ou exercer seus direitos:
            </p>
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-medium mb-4">🛡️ Encarregado de Proteção de Dados (DPO)</h4>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>📧 Email: privacidade@agentesdeconversao.com</li>
                <li>📱 WhatsApp: +55 (11) 99999-9999</li>
                <li>📍 Endereço: Av. Paulista, 1000 - São Paulo, SP, 01310-100</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}