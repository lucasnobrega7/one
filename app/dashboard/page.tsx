import type { Metadata } from "next"
import { auth } from "@/config/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import DashboardClient from "./dashboard-client"
import DashboardLoading from "./loading"

export const metadata: Metadata = {
  title: "Dashboard | Agentes de Conversão",
  description: "Painel de controle para gerenciar seus agentes de conversão",
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    return redirect("/login")
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient session={session} />
    </Suspense>
  )
}