"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StoreOverview from "@/components/store-overview"
import AlertsPanel from "@/components/alerts-panel"
import ComplianceStats from "@/components/compliance-stats"
import InventoryStatus from "@/components/inventory-status"

export default function DashboardView() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <StoreOverview onStoreSelect={setSelectedStore} />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <AlertsPanel selectedStore={selectedStore} />
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <ComplianceStats selectedStore={selectedStore} />
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <InventoryStatus selectedStore={selectedStore} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
