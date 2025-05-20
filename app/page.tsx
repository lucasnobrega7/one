"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ContextContainer } from '@/src/components/ui/context-container'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, MessageSquare, Share2, Code, Settings } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Immersive Context */}
      <ContextContainer 
        context="immersive" 
        particleType="lines"
        className="min-h-[80vh] flex items-center justify-center py-20"
      >
        <div className="container px-4 mx-auto text-center">
          <Image 
            src="/logo-agentesdeconversao-white.svg" 
            alt="Agentes de Conversão" 
            width={240} 
            height={60}
            className="mx-auto mb-8"
          />
          
          <h1 className="text-4xl sm:text-5xl font-semibold mb-6 text-white max-w-3xl mx-auto animate-float">
            Inteligência artificial personalizada para sua empresa
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Crie agentes de conversação inteligentes que transformam o atendimento ao cliente, 
            automação de processos e a geração de leads.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8">
              <Link href="/sign-up">
                Começar agora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10 rounded-full px-8">
              <Link href="/docs">
                Documentação
              </Link>
            </Button>
          </div>
        </div>
      </ContextContainer>
      
      {/* Features Section - Functional Context */}
      <ContextContainer context="functional" className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-6">Recursos Poderosos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo o que você precisa para criar, configurar e implementar agentes de conversação inteligentes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="hover-card-scale border-surface-stroke">
              <CardHeader>
                <Bot className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Agentes Personalizáveis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Crie agentes com personalidades específicas, bases de conhecimento personalizadas e fluxos de conversa avançados.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="hover-card-scale border-surface-stroke">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Integrações Múltiplas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Implante seus agentes em diversos canais: site, WhatsApp, Telegram, SMS e muito mais.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="hover-card-scale border-surface-stroke">
              <CardHeader>
                <Share2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Compartilhamento Fácil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Compartilhe seus agentes com sua equipe ou torne-os públicos com controle de acesso flexível.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 4 */}
            <Card className="hover-card-scale border-surface-stroke">
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Editor de Fluxos Visual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Crie fluxos de conversa complexos sem código usando nossa interface de arrastar e soltar.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 5 */}
            <Card className="hover-card-scale border-surface-stroke">
              <CardHeader>
                <Settings className="h-8 w-8 text-primary mb-2" />
                <CardTitle>API Robusta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integre agentes de conversação em seus próprios produtos e aplicativos com nossa API completa.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 6 */}
            <Card className="hover-card-scale border-surface-stroke">
              <CardHeader>
                <Bot className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Treinamento Contínuo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Melhore seus agentes constantemente com feedback de usuários e análise de conversas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContextContainer>
      
      {/* CTA Section - Immersive Context */}
      <ContextContainer 
        context="immersive" 
        particleType="dots"
        particleDensity="low"
        className="py-20"
      >
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 text-white">
            Pronto para transformar sua interação com clientes?
          </h2>
          
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Crie seu primeiro agente em minutos e veja o impacto imediato nos resultados.
          </p>
          
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
            <Link href="/sign-up">
              Comece gratuitamente <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </ContextContainer>
      
      {/* Footer - Functional Context */}
      <ContextContainer context="functional" className="py-10 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Image 
                src="/logo-agentesdeconversao-black.svg" 
                alt="Agentes de Conversão" 
                width={180} 
                height={45}
                className="dark:hidden"
              />
              <Image 
                src="/logo-agentesdeconversao-white.svg" 
                alt="Agentes de Conversão" 
                width={180} 
                height={45}
                className="hidden dark:block"
              />
            </div>
            
            <div className="flex flex-wrap gap-8">
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Produto</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm hover:text-primary">Recursos</Link></li>
                  <li><Link href="#" className="text-sm hover:text-primary">Preços</Link></li>
                  <li><Link href="#" className="text-sm hover:text-primary">Integrações</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Empresa</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm hover:text-primary">Sobre nós</Link></li>
                  <li><Link href="#" className="text-sm hover:text-primary">Blog</Link></li>
                  <li><Link href="#" className="text-sm hover:text-primary">Carreiras</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Suporte</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm hover:text-primary">Documentação</Link></li>
                  <li><Link href="#" className="text-sm hover:text-primary">FAQ</Link></li>
                  <li><Link href="#" className="text-sm hover:text-primary">Contato</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-border text-center md:text-left text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Agentes de Conversão. Todos os direitos reservados.</p>
          </div>
        </div>
      </ContextContainer>
    </div>
  )
}