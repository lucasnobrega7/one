"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Stars, Zap, BarChart3, Users, Bot, Sparkles, Globe, Lock } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { SubdomainLink } from "@/components/ui/subdomain-link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Logo variant="default" size="lg" className="text-white" />
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <SubdomainLink subdomain="docs" path="/docs" className="text-gray-300 hover:text-white transition-colors">
                  Docs
                </SubdomainLink>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <SubdomainLink subdomain="login" path="/login" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors">
                Log in
              </SubdomainLink>
              <SubdomainLink 
                subdomain="login" 
                path="/signup" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Try it free
              </SubdomainLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">Powered by OpenAI & Claude</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Impactful design,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                created effortlessly
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Build exceptional user interfaces with our design system.
              Ship your next project with velocity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/auth/signup"
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center"
              >
                Start for free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/demo"
                className="group bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 backdrop-blur-sm flex items-center"
              >
                <Globe className="mr-2 w-5 h-5" />
                View live demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-6">Already chosen by these forward thinking companies</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <div className="text-gray-400 font-semibold">ACME Corp</div>
                <div className="text-gray-400 font-semibold">Quantum</div>
                <div className="text-gray-400 font-semibold">Echo Valley</div>
                <div className="text-gray-400 font-semibold">Pulse</div>
                <div className="text-gray-400 font-semibold">Outside</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 lg:py-32 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Your creative process deserves
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  better.
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                You deserve to create exceptional work, but traditional design tools slow you down with unnecessary complexity and steep learning curves.
              </p>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-green-400 mb-4">
                That's why we built Layers.
              </h3>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Collaboration</h3>
                <p className="text-gray-400">Work together seamlessly with your team, wherever they are.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Prototyping</h3>
                <p className="text-gray-400">Build interactive prototypes that feel like the real thing.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Keyboard Quick Actions</h3>
                <p className="text-gray-400">Speed up your workflow with powerful keyboard shortcuts.</p>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Asset Library", "Code Preview", "Flow Mode", "Smart Sync",
                "Auto Layout", "Fast Search", "Smart Guides", "Version Control"
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm">
              <span className="text-blue-400">INTEGRATIONS</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Where power meets
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                simplicity
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
              We've achieved the impossible: making powerful design tools feel effortless. Create without friction, iterate without barriers.
            </p>

            {/* Integration Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Figma", desc: "Design handoff" },
                { name: "GitHub", desc: "Version control" },
                { name: "Notion", desc: "Documentation" },
                { name: "Framer", desc: "Prototyping" },
                { name: "Slack", desc: "Team communication" },
                { name: "Relume", desc: "Component library" }
              ].map((integration) => (
                <div key={integration.name} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-400 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{integration.name}</h3>
                  <p className="text-gray-400 text-sm">{integration.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 lg:py-32 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm">
                <span className="text-purple-400">FAQs</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Questions? We've
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  got answers
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How is Layers different from other design tools?",
                  answer: "Layers combines the power of professional design tools with the simplicity of modern interfaces. We eliminate complexity without sacrificing capability."
                },
                {
                  question: "Is there a learning curve?",
                  answer: "Our intuitive interface means you can start creating immediately. Most users are productive within their first session."
                },
                {
                  question: "How do you handle version control?",
                  answer: "Built-in version control tracks every change automatically. Collaborate with confidence knowing your work is always saved and backed up."
                },
                {
                  question: "Can I work offline?",
                  answer: "Yes! Layers works offline and syncs your changes when you're back online. Never lose your creative flow."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          
          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Stars className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-medium">Try it for free</span>
              <Stars className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-medium">Try it for free</span>
              <Stars className="w-6 h-6 text-yellow-400" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to create something
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                incredible?
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of creators who've already discovered the joy of effortless design.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/signup"
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center"
              >
                Start creating for free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center space-x-2 text-gray-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm">No credit card required</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <Logo variant="default" size="md" className="text-white mb-4" />
              <p className="text-gray-400 max-w-md">
                Building the future of design tools, one pixel at a time.
              </p>
            </div>
            
            <div className="flex space-x-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>© 2024 Agentes de Conversão. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}