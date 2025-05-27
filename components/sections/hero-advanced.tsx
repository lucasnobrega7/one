'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Play, Sparkles, Zap } from 'lucide-react'

const HeroAdvanced = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  // Examples for the typing animation
  const typingExamples = useMemo(() => [
    "Crie agentes de IA para WhatsApp Business",
    "Automatize atendimento ao cliente 24/7",
    "Integre ChatGPT em seus processos de vendas",
    "Desenvolva assistentes virtuais personalizados",
    "Conecte IA com CRM, E-commerce e APIs",
    "Gerencie leads com inteligência artificial"
  ], [])
  
  const [typingIndex, setTypingIndex] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)
  
  // Typing animation effect
  useEffect(() => {
    const currentText = typingExamples[typingIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setTypingText(currentText.substring(0, typingText.length + 1))
        
        // If completed typing current text
        if (typingText.length === currentText.length) {
          // Pause before deleting
          setTypingSpeed(1500)
          setIsDeleting(true)
        } else {
          // Regular typing speed
          setTypingSpeed(80 - Math.random() * 40)
        }
      } else {
        // Deleting
        setTypingText(currentText.substring(0, typingText.length - 1))
        
        // If completed deleting current text
        if (typingText.length === 0) {
          setIsDeleting(false)
          // Move to next example
          setTypingIndex((typingIndex + 1) % typingExamples.length)
          // Pause before typing next text
          setTypingSpeed(500)
        } else {
          // Regular deleting speed (faster than typing)
          setTypingSpeed(40 - Math.random() * 20)
        }
      }
    }, typingSpeed)
    
    return () => clearTimeout(timeout)
  }, [typingText, typingIndex, isDeleting, typingSpeed, typingExamples])
  
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-600 opacity-10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-60 -right-10 w-72 h-72 bg-purple-600 opacity-10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-pink-600 opacity-10 rounded-full filter blur-3xl"></div>
        
        {/* Grid background pattern */}
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
               backgroundSize: '20px 20px'
             }}>
        </div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Announcement badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 transition-colors">
              <Sparkles className="w-3 h-3 mr-1" />
              Nova versão com ReactFlow disponível
              <ArrowRight className="w-3 h-3 ml-1" />
            </Badge>
          </motion.div>
          
          {/* Main headline */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            Criando IA segura que{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              beneficia toda a humanidade
            </span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.h2 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Plataforma completa de agentes de IA conversacionais para empresas que desejam 
            automatizar atendimento, vendas e processos com inteligência artificial avançada
          </motion.h2>
          
          {/* Typing animation */}
          <motion.div 
            className="h-24 mb-12 flex items-center justify-center"
            variants={itemVariants}
          >
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-6 rounded-xl max-w-2xl mx-auto">
              <div className="flex items-center mb-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm ml-4">Terminal</span>
              </div>
              <p className="text-md md:text-lg text-left font-mono">
                <span className="text-green-400">agentes@conversao</span>
                <span className="text-gray-400">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-400">$ </span>
                <span className="text-white">{typingText}</span>
                <span className="inline-block w-2 h-5 bg-blue-400 ml-1 animate-pulse"></span>
              </p>
            </div>
          </motion.div>
          
          {/* CTA buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            variants={itemVariants}
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium group">
              Começar gratuitamente
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg font-medium"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver demonstração
            </Button>
          </motion.div>
          
          {/* Features grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-16"
            variants={itemVariants}
          >
            <div className="p-6 rounded-xl bg-gray-900/30 border border-gray-800">
              <Zap className="h-8 w-8 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">ReactFlow Builder</h3>
              <p className="text-gray-400 text-sm">
                Interface visual drag-and-drop para criar fluxos de automação complexos
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-900/30 border border-gray-800">
              <Sparkles className="h-8 w-8 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Streaming Real-time</h3>
              <p className="text-gray-400 text-sm">
                Chat em tempo real com WebSockets e streaming de respostas da IA
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-900/30 border border-gray-800">
              <ArrowRight className="h-8 w-8 text-pink-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Integrações Avançadas</h3>
              <p className="text-gray-400 text-sm">
                Conecte com WhatsApp, CRM, APIs e centenas de ferramentas
              </p>
            </div>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div 
            className="text-gray-400 text-sm"
            variants={itemVariants}
          >
            <p className="mb-6">Confiado por mais de 10.000 empresas em todo o Brasil</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="px-4 py-2 bg-gray-800 rounded text-xs">WhatsApp Business</div>
              <div className="px-4 py-2 bg-gray-800 rounded text-xs">HubSpot</div>
              <div className="px-4 py-2 bg-gray-800 rounded text-xs">Telegram</div>
              <div className="px-4 py-2 bg-gray-800 rounded text-xs">OpenAI</div>
              <div className="px-4 py-2 bg-gray-800 rounded text-xs">Railway</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroAdvanced