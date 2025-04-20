"use client"

import { LeadsTable } from "./components/leads-table"
import { useLeads } from "@/hooks/use-leads"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"

export default function LeadsPage() {
  const { leads, isLoading, isError, importLeads } = useLeads()
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    try {
      setIsImporting(true)
      await importLeads()
    } catch (error) {
      console.error("Failed to import leads:", error)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">Manage your leads</p>
          </div>
          <Button onClick={handleImport} disabled={isImporting}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isImporting ? "animate-spin" : ""}`}
            />
            {isImporting ? "Importing..." : "Import Leads"}
          </Button>
        </div>
        <LeadsTable leads={leads} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  )
} 