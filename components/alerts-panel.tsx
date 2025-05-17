import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, CheckCircle } from "lucide-react"

// Datos de ejemplo
const alertsData = [
  {
    id: "alert-1",
    storeId: "store-1",
    title: "Productos faltantes en anaquel principal",
    description: "Se detectaron 5 SKUs faltantes en el anaquel de bebidas.",
    severity: "high",
    timestamp: "Hace 2 horas",
    section: "Bebidas",
    hasInventory: true,
  },
  {
    id: "alert-2",
    storeId: "store-1",
    title: "Disposición incorrecta",
    description: "Los productos de limpieza no siguen el planograma establecido.",
    severity: "medium",
    timestamp: "Hace 5 horas",
    section: "Limpieza",
    hasInventory: true,
  },
  {
    id: "alert-3",
    storeId: "store-3",
    title: "Anaquel vacío",
    description: "El anaquel de productos de temporada está completamente vacío.",
    severity: "critical",
    timestamp: "Hace 1 día",
    section: "Temporada",
    hasInventory: false,
  },
  {
    id: "alert-4",
    storeId: "store-3",
    title: "Productos mal etiquetados",
    description: "Precios incorrectos en sección de lácteos.",
    severity: "low",
    timestamp: "Hace 2 días",
    section: "Lácteos",
    hasInventory: true,
  },
  {
    id: "alert-5",
    storeId: "store-2",
    title: "Productos caducados",
    description: "Se detectaron productos con fecha vencida en panadería.",
    severity: "high",
    timestamp: "Hace 3 horas",
    section: "Panadería",
    hasInventory: true,
  },
]

interface AlertsPanelProps {
  selectedStore: string | null
}

export default function AlertsPanel({ selectedStore }: AlertsPanelProps) {
  const filteredAlerts = selectedStore ? alertsData.filter((alert) => alert.storeId === selectedStore) : alertsData

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500">Crítico</Badge>
      case "high":
        return <Badge className="bg-orange-500">Alto</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medio</Badge>
      case "low":
        return <Badge className="bg-blue-500">Bajo</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Alertas de Planogramas</h3>
        {selectedStore && (
          <Badge variant="outline" className="ml-2">
            Filtrando por tienda
          </Badge>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="critical">Críticas</TabsTrigger>
          <TabsTrigger value="high">Altas</TabsTrigger>
          <TabsTrigger value="medium">Medias</TabsTrigger>
          <TabsTrigger value="low">Bajas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <p>No hay alertas activas para esta tienda.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">{alert.description}</CardDescription>
                    </div>
                    {getSeverityBadge(alert.severity)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-between items-center text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Sección:</span>
                        <span>{alert.section}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Detectado:</span>
                        <span>{alert.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Inventario disponible:</span>
                        <span>{alert.hasInventory ? "Sí" : "No"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <Button size="sm" variant="outline">
                        Asignar
                      </Button>
                      <Button size="sm">
                        Resolver
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          {filteredAlerts
            .filter((a) => a.severity === "critical")
            .map((alert) => (
              <Card key={alert.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">{alert.description}</CardDescription>
                    </div>
                    {getSeverityBadge(alert.severity)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-between items-center text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Sección:</span>
                        <span>{alert.section}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Detectado:</span>
                        <span>{alert.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Inventario disponible:</span>
                        <span>{alert.hasInventory ? "Sí" : "No"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <Button size="sm" variant="outline">
                        Asignar
                      </Button>
                      <Button size="sm">
                        Resolver
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* Contenido similar para otras pestañas de severidad */}
      </Tabs>
    </div>
  )
}
