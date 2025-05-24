import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-normal mb-6">
            Entre em{" "}
            <span className="gradient-text-langflow">Contato</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a criar os melhores agentes de conversão
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="hero-card-langflow">
            <CardHeader>
              <CardTitle className="text-2xl">Envie uma mensagem</CardTitle>
              <CardDescription>
                Responderemos em até 24 horas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome completo"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="seu@email.com"
                    className="bg-input border-border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa (opcional)</Label>
                <Input 
                  id="company" 
                  placeholder="Nome da sua empresa"
                  className="bg-input border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input 
                  id="subject" 
                  placeholder="Como podemos ajudar?"
                  className="bg-input border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message" 
                  placeholder="Descreva sua necessidade ou dúvida..."
                  rows={6}
                  className="bg-input border-border"
                />
              </div>
              
              <Button className="btn-primary-langflow w-full">
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="hero-card-langflow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email</h3>
                    <p className="text-muted-foreground">contato@agentesdeconversao.com</p>
                    <p className="text-muted-foreground">suporte@agentesdeconversao.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hero-card-langflow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MessageSquare className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                    <p className="text-muted-foreground">+55 (11) 99999-9999</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Segunda a Sexta, 9h às 18h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hero-card-langflow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-purple-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Telefone</h3>
                    <p className="text-muted-foreground">+55 (11) 3000-0000</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Para emergências: 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hero-card-langflow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-yellow-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Escritório</h3>
                    <p className="text-muted-foreground">
                      Av. Paulista, 1000 - 10º andar<br />
                      Bela Vista, São Paulo - SP<br />
                      01310-100
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-normal text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hero-card-langflow">
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o período de teste?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oferecemos 14 dias gratuitos para você testar todas as funcionalidades 
                  da plataforma sem limitações.
                </p>
              </CardContent>
            </Card>

            <Card className="hero-card-langflow">
              <CardHeader>
                <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim, você pode cancelar sua assinatura a qualquer momento sem taxas 
                  de cancelamento ou multas.
                </p>
              </CardContent>
            </Card>

            <Card className="hero-card-langflow">
              <CardHeader>
                <CardTitle className="text-lg">Que tipos de integração vocês oferecem?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  WhatsApp, APIs REST, Webhooks, Zapier, e integrações customizadas 
                  para grandes empresas.
                </p>
              </CardContent>
            </Card>

            <Card className="hero-card-langflow">
              <CardHeader>
                <CardTitle className="text-lg">Como é o suporte técnico?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Suporte via chat 24/7, email com resposta em até 24h, e suporte 
                  telefônico para planos Enterprise.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}