"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detectar scroll para mudar a aparência da navegação
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Recursos", href: "/features" },
    { name: "Preços", href: "/pricing" },
    { name: "Documentação", href: "/docs" },
  ]

  return (
    <header
      className={`openai-nav fixed w-full z-50 ${scrolled ? "scrolled" : ""}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM14.5 21.5C14.5 22.881 13.381 24 12 24C10.619 24 9.5 22.881 9.5 21.5C9.5 20.119 10.619 19 12 19C13.381 19 14.5 20.119 14.5 21.5ZM14.5 10.5C14.5 11.881 13.381 13 12 13C10.619 13 9.5 11.881 9.5 10.5C9.5 9.119 10.619 8 12 8C13.381 8 14.5 9.119 14.5 10.5ZM20 16C20 17.381 18.881 18.5 17.5 18.5C16.119 18.5 15 17.381 15 16C15 14.619 16.119 13.5 17.5 13.5C18.881 13.5 20 14.619 20 16ZM22.5 21.5C22.5 22.881 21.381 24 20 24C18.619 24 17.5 22.881 17.5 21.5C17.5 20.119 18.619 19 20 19C21.381 19 22.5 20.119 22.5 21.5ZM22.5 10.5C22.5 11.881 21.381 13 20 13C18.619 13 17.5 11.881 17.5 10.5C17.5 9.119 18.619 8 20 8C21.381 8 22.5 9.119 22.5 10.5Z"
                  fill="white"
                />
              </svg>
              <span className="font-medium">Agentes de Conversão</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm transition-colors ${isActive(item.href) ? "text-white font-medium" : "text-white/70 hover:text-white"}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" ? (
              <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                <Link href="/dashboard">Meu Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="btn-openai-ghost">
                  Entrar
                </Link>
                <Link href="/signup" className="btn-openai-primary">
                  Criar conta
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm transition-colors ${isActive(item.href) ? "text-white font-medium" : "text-white/70"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                {status === "authenticated" ? (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/dashboard">Meu Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Link href="/login" className="btn-openai-ghost w-full text-left">
                      Entrar
                    </Link>
                    <Link href="/signup" className="btn-openai-primary w-full text-left">
                      Criar conta
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
