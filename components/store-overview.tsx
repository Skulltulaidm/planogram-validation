"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowUpRight, Store, CheckCircle2, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo
const storeData = [
  {
    id: "store-1",
    name: "Tienda Centro",
    compliance: 87,
    alerts: 5,
    pendingTasks: 3,
    status: "warning",
  },
  {
    id: "store-2",
    name: "Tienda Norte",
    compliance: 94,
    alerts: 2,
    pendingTasks: 1,
    status: "success",
  },
  {
    id: "store-3",
    name: "Tienda Sur",
    compliance: 72,
    alerts: 12,
    pendingTasks: 8,
    status: "critical",
  },
  {
    id: "store-4",
    name: "Tienda Este",
    compliance: 91,
    alerts: 3,
    pendingTasks: 2,
    status: "warning",
  },
]

interface StoreOverviewProps {
  onStoreSelect: (storeId: string) => void
}

export default function StoreOverview({ onStoreSelect }: StoreOverviewProps) {
  const [region, setRegion] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Óptimo</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Atención</Badge>
      case "critical":
        return <Badge className="bg-red-500">Crítico</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const filteredStores = region === "all" ? storeData : storeData.filter((store) => store.id.includes(region))

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold">Vista General de Tiendas</h3>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar región" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las regiones</SelectItem>
            <SelectItem value="store-1">Región Centro</SelectItem>
            <SelectItem value="store-2">Región Norte</SelectItem>
            <SelectItem value="store-3">Región Sur</SelectItem>
            <SelectItem value="store-4">Región Este</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento Promedio</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(filteredStores.reduce((acc, store) => acc + store.compliance, 0) / filteredStores.length)}%
            </div>
            <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStores.reduce((acc, store) => acc + store.alerts, 0)}</div>
            <p className="text-xs text-muted-foreground">-12% desde la semana pasada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredStores.reduce((acc, store) => acc + store.pendingTasks, 0)}
            </div>
            <p className="text-xs text-muted-foreground">+2 nuevas desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiendas Monitoreadas</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStores.length}</div>
            <p className="text-xs text-muted-foreground">De un total de {storeData.length} tiendas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Tiendas</CardTitle>
          <CardDescription>Monitoreo en tiempo real del cumplimiento de planogramas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {filteredStores.map((store) => (
              <div key={store.id} className="flex items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{store.name}</p>
                    {getStatusBadge(store.status)}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <Progress value={store.compliance} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground min-w-[60px]">{store.compliance}%</div>
                    <Button variant="outline" size="sm" className="ml-auto" onClick={() => onStoreSelect(store.id)}>
                      Ver detalles
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredStores.some((store) => store.status === "critical") && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alerta crítica</AlertTitle>
          <AlertDescription>Hay tiendas con estado crítico que requieren atención inmediata.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
