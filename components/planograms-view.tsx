"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { useIsMobile } from "@/hooks/use-mobile"
import { Search, LayoutGrid, Plus, ArrowUpRight, Filter, Download, Share2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo
const planogramsData = [
  {
    id: "plano-1",
    name: "Bebidas Refrigeradas",
    category: "Bebidas",
    department: "Alimentos y Bebidas",
    lastUpdated: "2023-05-10",
    version: "2.3",
    status: "active",
    storeCount: 120,
    compliance: 87,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "plano-2",
    name: "Snacks y Botanas",
    category: "Snacks",
    department: "Alimentos y Bebidas",
    lastUpdated: "2023-06-15",
    version: "1.5",
    status: "active",
    storeCount: 150,
    compliance: 92,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "plano-3",
    name: "Productos de Limpieza",
    category: "Limpieza",
    department: "Hogar",
    lastUpdated: "2023-04-20",
    version: "3.1",
    status: "draft",
    storeCount: 0,
    compliance: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "plano-4",
    name: "Lácteos",
    category: "Lácteos",
    department: "Alimentos y Bebidas",
    lastUpdated: "2023-05-25",
    version: "2.0",
    status: "active",
    storeCount: 135,
    compliance: 85,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "plano-5",
    name: "Cuidado Personal",
    category: "Higiene",
    department: "Cuidado Personal",
    lastUpdated: "2023-06-05",
    version: "1.8",
    status: "active",
    storeCount: 110,
    compliance: 90,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "plano-6",
    name: "Productos de Temporada",
    category: "Temporada",
    department: "Promociones",
    lastUpdated: "2023-06-20",
    version: "1.0",
    status: "draft",
    storeCount: 0,
    compliance: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export default function PlanogramsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const isMobile = useIsMobile()

  const filteredPlanograms = planogramsData.filter((planogram) => {
    const matchesSearch =
      planogram.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planogram.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planogram.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || planogram.category === categoryFilter
    const matchesStatus = statusFilter === "all" || planogram.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Activo</Badge>
      case "draft":
        return <Badge className="bg-yellow-500">Borrador</Badge>
      case "archived":
        return <Badge className="bg-gray-500">Archivado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile ? <MobileNav /> : <MainNav />}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Planogramas</h2>
          <UserNav />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar planogramas..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Bebidas">Bebidas</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
                <SelectItem value="Limpieza">Limpieza</SelectItem>
                <SelectItem value="Lácteos">Lácteos</SelectItem>
                <SelectItem value="Higiene">Higiene</SelectItem>
                <SelectItem value="Temporada">Temporada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="archived">Archivados</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Más Filtros
            </Button>
            <Button className="w-full sm:w-auto bg-oxxo-red hover:bg-oxxo-red/90">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Planograma
            </Button>
          </div>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlanograms.map((planogram) => (
                <Card key={planogram.id} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted">
                    <img
                      src={planogram.thumbnail || "/placeholder.svg"}
                      alt={planogram.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{planogram.name}</CardTitle>
                      {getStatusBadge(planogram.status)}
                    </div>
                    <CardDescription>
                      {planogram.category} | {planogram.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Versión:</p>
                        <p>{planogram.version}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actualizado:</p>
                        <p>{new Date(planogram.lastUpdated).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tiendas:</p>
                        <p>{planogram.storeCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cumplimiento:</p>
                        <p>{planogram.compliance > 0 ? `${planogram.compliance}%` : "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Descargar</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Compartir</span>
                      </Button>
                    </div>
                    <Button variant="outline">
                      Ver Detalles
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Planogramas</CardTitle>
                <CardDescription>
                  Total: {filteredPlanograms.length} planogramas {searchTerm && "encontrados"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                    {filteredPlanograms.map((planogram) => (
                      <div key={planogram.id} className="flex flex-col border rounded-md overflow-hidden">
                        <div className="aspect-video w-full bg-muted">
                          <img
                            src={planogram.thumbnail || "/placeholder.svg"}
                            alt={planogram.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-sm">{planogram.name}</h3>
                            {getStatusBadge(planogram.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {planogram.category} | v{planogram.version}
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Ver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Planogramas</CardTitle>
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{planogramsData.length}</div>
              <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Planogramas Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{planogramsData.filter((p) => p.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((planogramsData.filter((p) => p.status === "active").length / planogramsData.length) * 100)}
                % del total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cumplimiento Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  planogramsData.filter((p) => p.compliance > 0).reduce((acc, p) => acc + p.compliance, 0) /
                    planogramsData.filter((p) => p.compliance > 0).length,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">+2% desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{planogramsData.filter((p) => p.status === "draft").length}</div>
              <p className="text-xs text-muted-foreground">Pendientes de publicación</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
