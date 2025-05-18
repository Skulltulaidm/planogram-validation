"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Store, Plus, ArrowUpRight, Filter, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import NewStoreForm from "./NewStoreForm"
import StoreMap from "./StoreMap"
import type { Database } from "@/lib/supabase/database.types"

// Definir el tipo Store basado en la base de datos
type Store = Database['public']['Tables']['stores']['Row'] & {
  manager_name?: string // Para almacenar el nombre completo del gerente
}

export default function StoresView() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regions, setRegions] = useState<string[]>([])
  const [showNewStoreDialog, setShowNewStoreDialog] = useState(false)

  // Cargar tiendas desde Supabase
  useEffect(() => {
    fetchStores()
  }, [])

  async function fetchStores() {
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase
        .from('stores')
        .select(`
        *,
        profiles:manager_id(first_name, last_name)
      `)

    if (error) {
      console.error('Error al cargar tiendas:', error)
    } else {
      // Procesar los datos para agregar nombre completo del gerente
      const processedStores = data.map(store => ({
        ...store,
        manager_name: store.profiles
            ? `${store.profiles.first_name} ${store.profiles.last_name}`
            : 'Sin asignar'
      }))

      setStores(processedStores)

      // Extraer regiones únicas para el filtro
      const uniqueRegions = [...new Set(processedStores.map(store => store.region))]
      setRegions(uniqueRegions)
    }

    setLoading(false)
  }

  // Filtrar tiendas según los criterios
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.manager_name && store.manager_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRegion = regionFilter === "all" || store.region === regionFilter
    const matchesStatus = statusFilter === "all" || store.status === statusFilter

    return matchesSearch && matchesRegion && matchesStatus
  })

  // Función para el badge de estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Activa</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">Inactiva</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">En Mantenimiento</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  // Manejar la creación exitosa de una tienda
  const handleStoreCreated = () => {
    fetchStores() // Recargar tiendas
    setShowNewStoreDialog(false) // Cerrar diálogo
  }

  return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Tiendas</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Búsqueda */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  type="search"
                  placeholder="Buscar tiendas..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtros y botón nueva tienda */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {/* Filtro de región */}
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro de estado */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                  <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                </SelectContent>
              </Select>

              {/* Botón más filtros */}
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Más Filtros
              </Button>

              {/* Diálogo para nueva tienda */}
              <Dialog open={showNewStoreDialog} onOpenChange={setShowNewStoreDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-oxxo-red hover:bg-oxxo-red/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Tienda
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Agregar Nueva Tienda</DialogTitle>
                  </DialogHeader>
                  <NewStoreForm onSuccess={handleStoreCreated} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tabs para Lista y Mapa */}
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="map">Mapa</TabsTrigger>
            </TabsList>

            {/* Tab de Lista */}
            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Tiendas</CardTitle>
                  <CardDescription>
                    Total: {filteredStores.length} tiendas {searchTerm && "encontradas"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                      <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                  ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden md:table-cell">Dirección</TableHead>
                            <TableHead className="hidden md:table-cell">Región</TableHead>
                            <TableHead className="hidden md:table-cell">Gerente</TableHead>
                            <TableHead>Cumplimiento</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStores.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                  No se encontraron tiendas con los filtros actuales
                                </TableCell>
                              </TableRow>
                          ) : (
                              filteredStores.map((store) => (
                                  <TableRow key={store.id}>
                                    <TableCell className="font-medium">{store.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{store.address}</TableCell>
                                    <TableCell className="hidden md:table-cell">{store.region}</TableCell>
                                    <TableCell className="hidden md:table-cell">{store.manager_name}</TableCell>
                                    <TableCell>{store.compliance}%</TableCell>
                                    <TableCell>{getStatusBadge(store.status)}</TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-oxxo-red"
                                          onClick={() => router.push(`/tiendas/${store.id}`)}
                                      >
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="sr-only">Ver detalles</span>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {filteredStores.length} de {stores.length} tiendas
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm">
                      Siguiente
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tab de Mapa */}
            <TabsContent value="map" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa de Tiendas</CardTitle>
                  <CardDescription>Visualización geográfica de las tiendas</CardDescription>
                </CardHeader>
                <CardContent>
                  <StoreMap stores={filteredStores} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Resumen de estadísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Tiendas</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stores.length}</div>
                <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 5)} desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tiendas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stores.filter((s) => s.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stores.filter((s) => s.status === "active").length / (stores.length || 1)) * 100)}% del
                  total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cumplimiento Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(stores.reduce((acc, store) => acc + store.compliance, 0) / Math.max(1, stores.length))}%
                </div>
                <p className="text-xs text-muted-foreground">+3% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tiendas en Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stores.filter((s) => s.status === "maintenance").length}</div>
                <p className="text-xs text-muted-foreground">-1 desde la semana pasada</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}