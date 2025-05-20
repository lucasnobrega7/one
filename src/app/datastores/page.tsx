import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DatastoreList } from "@/components/datastores/datastore-list"

export const metadata: Metadata = {
  title: "Datastores",
  description: "Manage your data sources",
}

export default function DatastoresPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Datastores" text="Manage your data sources for AI agents.">
        <Link href="/datastores/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Datastore
          </Button>
        </Link>
      </DashboardHeader>
      <DatastoreList />
    </DashboardShell>
  )
}
