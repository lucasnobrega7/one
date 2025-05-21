import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Hero } from "@/components/sections/hero"
import { FeaturesGrid } from "@/components/sections/features-grid"
import { CTA } from "@/components/sections/cta"
import { Footer } from "@/components/sections/footer"
import { ArrowRight, Zap, Shield, Gauge, Globe, Lightning, ArrowUpRight } from "lucide-react"

export default function ExamplePage() {
  // Sample features for the features grid section
  const features = [
    {
      title: "Lightning Fast Performance",
      description: "Optimize your site for speed with our advanced performance enhancements, ensuring quick load times and smooth user experiences.",
      icon: Gauge
    },
    {
      title: "Enterprise-Grade Security",
      description: "Rest easy knowing your data is protected by industry-leading security measures and best practices.",
      icon: Shield
    },
    {
      title: "Global CDN",
      description: "Deliver content quickly to users anywhere in the world with our distributed content delivery network.",
      icon: Globe
    },
    {
      title: "Developer Experience",
      description: "Enjoy a streamlined workflow with tools and processes designed to maximize productivity and creativity.",
      icon: Zap
    },
    {
      title: "Instant Deployment",
      description: "Push changes and see them live in seconds with our efficient deployment pipeline.",
      icon: Lightning
    },
    {
      title: "Advanced Analytics",
      description: "Gain valuable insights into your users' behavior with comprehensive analytics and reporting tools.",
      icon: ArrowUpRight
    }
  ]

  // Navigation links for the footer
  const footerNavigation = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Resources", href: "#" },
        { name: "Changelog", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Security", href: "#" }
      ]
    }
  ]

  return (
    <main>
      {/* Hero Section */}
      <Hero
        title="Build beautiful interfaces with our Design System"
        description="A professionally designed UI system for modern web applications. Build stunning, accessible interfaces with minimal effort."
        action={{
          text: "Get Started",
          href: "#",
          variant: "gradient"
        }}
        secondaryAction={{
          text: "Learn More",
          href: "#",
          variant: "outline"
        }}
      />

      {/* Demo Section */}
      <section className="py-16 bg-surface-base">
        <Container>
          <Heading as="h2" className="text-center mb-12">
            Flexible Components
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cards */}
            <div className="space-y-6">
              <Heading as="h3" size="h4" className="mb-4">
                Card Variants
              </Heading>
              
              <Card variant="default" className="mb-4">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>With subtle shadow and border</CardDescription>
                </CardHeader>
                <CardContent>
                  Standard card with clean styling for most use cases.
                </CardContent>
              </Card>
              
              <Card variant="elevated" className="mb-4">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>With pronounced shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  Stands out more from the background with elevated appearance.
                </CardContent>
              </Card>
              
              <Card variant="outline" className="mb-4">
                <CardHeader>
                  <CardTitle>Outline Card</CardTitle>
                  <CardDescription>Just a border, no background</CardDescription>
                </CardHeader>
                <CardContent>
                  Minimal styling for subtle grouping of content.
                </CardContent>
              </Card>
              
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Gradient Card</CardTitle>
                  <CardDescription className="text-white/90">With accent gradient background</CardDescription>
                </CardHeader>
                <CardContent>
                  Eye-catching gradient for important content or CTAs.
                </CardContent>
              </Card>
            </div>
            
            {/* Buttons */}
            <div className="space-y-6">
              <Heading as="h3" size="h4" className="mb-4">
                Button Variants
              </Heading>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link Button</Button>
                  <Button variant="gradient">Gradient</Button>
                </div>
                
                <Heading as="h4" size="h4" className="mt-8 mb-4">
                  Button Sizes
                </Heading>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" variant="outline"><ArrowRight /></Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <FeaturesGrid
        title="Powerful Features"
        description="Everything you need to build modern, high-performance web applications."
        features={features}
        columns={3}
        variant="cards"
      />

      {/* CTA Section */}
      <CTA
        title="Ready to get started?"
        description="Join thousands of developers building better websites today."
        variant="gradient"
        action={{
          text: "Start Building",
          href: "#",
          variant: "default"
        }}
        secondaryAction={{
          text: "Learn More",
          href: "#",
          variant: "outline"
        }}
      />

      {/* Footer */}
      <Footer
        logo={
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6" />
            <span className="text-xl font-semibold">Company</span>
          </div>
        }
        navigation={footerNavigation}
        legal={[
          { name: "Privacy", href: "#" },
          { name: "Terms", href: "#" },
          { name: "Cookies", href: "#" }
        ]}
        social={[
          { name: "Twitter", href: "#", icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg> },
          { name: "GitHub", href: "#", icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg> },
          { name: "LinkedIn", href: "#", icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z" /></svg> }
        ]}
      />
    </main>
  )
}