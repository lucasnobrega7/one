export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal mb-4">
            Termos de <span className="gradient-text-langflow">Uso</span>
          </h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar a plataforma Agentes de Conversão, você concorda em cumprir 
              e estar vinculado aos termos e condições descritos neste documento. Se você 
              não concordar com algum destes termos, não deve usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Agentes de Conversão é uma plataforma SaaS que permite criar, configurar 
              e gerenciar agentes de inteligência artificial para automatizar conversas 
              e melhorar as taxas de conversão.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Criação de agentes de IA personalizados</li>
              <li>Integração com WhatsApp, websites e APIs</li>
              <li>Base de conhecimento customizável</li>
              <li>Analytics e relatórios de performance</li>
              <li>Suporte técnico e documentação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Registro e Conta</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para usar nossos serviços, você deve:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Fornecer informações precisas e atualizadas</li>
              <li>Manter a segurança de sua conta e senha</li>
              <li>Notificar-nos imediatamente sobre uso não autorizado</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Planos e Pagamento</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">4.1 Planos de Assinatura</h3>
              <p className="text-muted-foreground leading-relaxed">
                Oferecemos diferentes planos de assinatura com recursos e limites específicos. 
                Os detalhes estão disponíveis em nossa página de preços.
              </p>
              
              <h3 className="text-lg font-medium">4.2 Cobrança</h3>
              <p className="text-muted-foreground leading-relaxed">
                As assinaturas são cobradas antecipadamente. O não pagamento pode resultar 
                na suspensão ou cancelamento dos serviços.
              </p>
              
              <h3 className="text-lg font-medium">4.3 Reembolsos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Oferecemos garantia de reembolso de 14 dias para novos usuários. 
                Cancelamentos podem ser feitos a qualquer momento.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Uso Aceitável</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você concorda em não usar nossos serviços para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Atividades ilegais ou fraudulentas</li>
              <li>Spam ou comunicações não solicitadas</li>
              <li>Violação de direitos de terceiros</li>
              <li>Distribuição de malware ou código malicioso</li>
              <li>Sobrecarga excessiva de nossos sistemas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Todos os direitos, títulos e interesses em nossos serviços, incluindo 
              software, conteúdo e marcas registradas, permanecem nossa propriedade exclusiva.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Você mantém a propriedade de seus dados e conteúdo. Concedemos a você uma 
              licença limitada para usar nossos serviços de acordo com estes termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Privacidade e Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Seu uso de nossos serviços também é regido por nossa Política de Privacidade, 
              que faz parte destes termos por referência.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Coletamos apenas dados necessários para o serviço</li>
              <li>Seus dados são criptografados e protegidos</li>
              <li>Não vendemos suas informações pessoais</li>
              <li>Você pode exportar ou deletar seus dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nossos serviços são fornecidos "como estão". Não garantimos que serão 
              ininterruptos ou livres de erros. Nossa responsabilidade é limitada ao 
              valor pago pelos serviços nos últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Modificações</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos modificar estes termos a qualquer momento. Mudanças significativas 
              serão notificadas com pelo menos 30 dias de antecedência. O uso continuado 
              dos serviços constitui aceitação das modificações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para questões sobre estes termos, entre em contato conosco:
            </p>
            <ul className="list-none text-muted-foreground space-y-2">
              <li>📧 Email: legal@agentesdeconversao.com</li>
              <li>📱 WhatsApp: +55 (11) 99999-9999</li>
              <li>📍 Endereço: Av. Paulista, 1000 - São Paulo, SP</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}