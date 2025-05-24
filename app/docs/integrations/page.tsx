import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Webhook, 
  Zap, 
  Globe, 
  Smartphone, 
  Code, 
  ExternalLink,
  CheckCircle
} from "lucide-react"

const integrations = [
  {
    name: "WhatsApp Business",
    description: "Conecte seus agentes diretamente ao WhatsApp",
    icon: MessageSquare,
    category: "Messaging",
    status: "Disponível",
    difficulty: "Fácil",
    docs: "/docs/whatsapp-integration"
  },
  {
    name: "Webhook API",
    description: "Receba notificações em tempo real",
    icon: Webhook,
    category: "API",
    status: "Disponível", 
    difficulty: "Intermediário",
    docs: "/docs/webhooks"
  },
  {
    name: "Zapier",
    description: "Conecte com milhares de aplicações",
    icon: Zap,
    category: "Automation",
    status: "Em breve",
    difficulty: "Fácil",
    docs: "/docs/zapier"
  },
  {
    name: "REST API",
    description: "API completa para desenvolvedores",
    icon: Code,
    category: "API",
    status: "Disponível",
    difficulty: "Avançado",
    docs: "/docs/api-reference"
  },
  {
    name: "Website Widget",
    description: "Chat widget para seu site",
    icon: Globe,
    category: "Web",
    status: "Disponível",
    difficulty: "Fácil",
    docs: "/docs/widget"
  },
  {
    name: "Mobile SDK",
    description: "SDK para aplicações móveis",
    icon: Smartphone,
    category: "Mobile",
    status: "Em desenvolvimento",
    difficulty: "Avançado",
    docs: "/docs/mobile-sdk"
  }
]

const tutorials = [
  {
    title: "Conectar WhatsApp em 5 minutos",
    description: "Tutorial passo a passo para integrar com WhatsApp Business",
    duration: "5 min",
    difficulty: "Fácil"
  },
  {
    title: "Configurar Webhooks",
    description: "Como receber notificações de conversas em tempo real",
    duration: "10 min", 
    difficulty: "Intermediário"
  },
  {
    title: "API Authentication",
    description: "Autenticação e primeiros requests para nossa API",
    duration: "15 min",
    difficulty: "Avançado"
  },
  {
    title: "Customizar Widget do Site",
    description: "Personalizar aparência e comportamento do chat",
    duration: "8 min",
    difficulty: "Fácil"
  }
]

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-normal mb-6">
            <span className="gradient-text-langflow">Integrações</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conecte seus agentes de conversão com as ferramentas que você já usa. 
            APIs simples, webhooks em tempo real e integrações prontas.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-16">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => {
                const Icon = integration.icon
                return (
                  <Card key={integration.name} className="hero-card-langflow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon className="h-8 w-8 text-blue-400" />
                        <div className="flex space-x-2">
                          <Badge 
                            variant={integration.status === "Disponível" ? "default" : "secondary"}
                            className={integration.status === "Disponível" ? "bg-green-500/20 text-green-400" : ""}
                          >
                            {integration.status}
                          </Badge>
                          <Badge variant="outline">
                            {integration.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{integration.name}</CardTitle>
                      <CardDescription>
                        {integration.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full btn-outline-langflow"
                        disabled={integration.status !== "Disponível"}
                      >
                        Ver Documentação
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {["messaging", "api", "web", "automation"].map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations
                  .filter(integration => integration.category.toLowerCase() === category)
                  .map((integration) => {
                    const Icon = integration.icon
                    return (
                      <Card key={integration.name} className="hero-card-langflow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Icon className="h-8 w-8 text-blue-400" />
                            <Badge 
                              variant={integration.status === "Disponível" ? "default" : "secondary"}
                              className={integration.status === "Disponível" ? "bg-green-500/20 text-green-400" : ""}
                            >
                              {integration.status}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{integration.name}</CardTitle>
                          <CardDescription>
                            {integration.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            className="w-full btn-outline-langflow"
                            disabled={integration.status !== "Disponível"}
                          >
                            Ver Documentação
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Start Tutorials */}
        <div className="mb-16">
          <h2 className="text-3xl font-normal text-center mb-12">
            Tutoriais de Início Rápido
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hero-card-langflow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge variant="outline">{tutorial.duration}</Badge>
                      <Badge variant="secondary">{tutorial.difficulty}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {tutorial.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full btn-primary-langflow">
                    Começar Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Support */}
        <Card className="hero-card-langflow">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Precisa de uma integração personalizada?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Nossa equipe pode desenvolver integrações customizadas para atender 
              às necessidades específicas da sua empresa.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Desenvolvimento sob medida</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Suporte técnico dedicado</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>SLA garantido</span>
              </div>
            </div>
            
            <Button size="lg" className="btn-primary-langflow">
              Falar com Especialista
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}