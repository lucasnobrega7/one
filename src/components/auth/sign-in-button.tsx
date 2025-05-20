"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function SignInButton() {
  return (
    <Button variant="outline" className="w-full" onClick={() => console.log("Sign in with GitHub")}>
      <Github className="mr-2 h-4 w-4" />
      Sign in with GitHub
    </Button>
  )
}
