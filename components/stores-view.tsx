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
import { Search, MapPin, Store, Plus, ArrowUpRight, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo
const storesData = [
  {
    id: "store-1",
    name: "Oxxo Centro",
    address: "Av. Revolución 123, Centro",
    city: "Ciudad de México",
    region: "Centro",
    manager: "Carlos Rodríguez",
    compliance: 87,
    status: "active",
  },
  {
    id: "store-2",
    name: "Oxxo Norte",
    address: "Blvd. Manuel Ávila Camacho 456, Polanco",
    city: "Ciudad de México",
    region: "Norte",
    manager: "Ana López",
    compliance: 94,
    status: "active",
  },
  {
    id: "store-3",
    name: "Oxxo Sur",
    address: "Av. Universidad 789, Coyoacán",
    city: "Ciudad de México",
    region: "Sur",
    manager: "Roberto Gómez",
    compliance: 72,
    status: "maintenance",
  },
  {
    id: "store-4",
    name: "Oxxo Este",
    address: "Calz. Ignacio Zaragoza 321, Iztacalco",
    city: "Ciudad de México",
    region: "Este",
    manager: "María Sánchez",
    compliance: 91,
    status: "active",
  },
  {
    id: "store-5",
    name: "Oxxo Oeste",
    address: "Av. Constituyentes 654, Miguel Hidalgo",
    city: "Ciudad de México",
    region: "Oeste",
    manager: "Javier Martínez",
    compliance: 88,
    status: "active",
  },
  {
    id: "store-6",
    name: "Oxxo Reforma",
    address: "Paseo de la Reforma 987, Cuauhtémoc",
    city: "Ciudad de México",
    region: "Centro",
    manager: "Laura Díaz",
    compliance: 79,
    status: "inactive",
  },
]

export default function StoresView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const isMobile = useIsMobile()

  const filteredStores = storesData.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.manager.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRegion = regionFilter === "all" || store.region === regionFilter
    const matchesStatus = statusFilter === "all" || store.status === statusFilter

    return matchesSearch && matchesRegion && matchesStatus
  })

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

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile ? <MobileNav /> : <MainNav />}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tiendas</h2>
          <UserNav />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                <SelectItem value="Centro">Centro</SelectItem>
                <SelectItem value="Norte">Norte</SelectItem>
                <SelectItem value="Sur">Sur</SelectItem>
                <SelectItem value="Este">Este</SelectItem>
                <SelectItem value="Oeste">Oeste</SelectItem>
              </SelectContent>
            </Select>
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
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Más Filtros
            </Button>
            <Button className="w-full sm:w-auto bg-oxxo-red hover:bg-oxxo-red/90">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Tienda
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="map">Mapa</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Tiendas</CardTitle>
                <CardDescription>
                  Total: {filteredStores.length} tiendas {searchTerm && "encontradas"}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    {filteredStores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{store.address}</TableCell>
                        <TableCell className="hidden md:table-cell">{store.region}</TableCell>
                        <TableCell className="hidden md:table-cell">{store.manager}</TableCell>
                        <TableCell>{store.compliance}%</TableCell>
                        <TableCell>{getStatusBadge(store.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-oxxo-red">
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredStores.length} de {storesData.length} tiendas
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

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Tiendas</CardTitle>
                <CardDescription>Visualización geográfica de las tiendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <MapPin className="h-16 w-16 mb-2" />
                    <p>Mapa de ubicación de tiendas</p>
                    <p className="text-sm">(Integración de mapa pendiente)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Tiendas</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storesData.length}</div>
              <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tiendas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storesData.filter((s) => s.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((storesData.filter((s) => s.status === "active").length / storesData.length) * 100)}% del
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
                {Math.round(storesData.reduce((acc, store) => acc + store.compliance, 0) / storesData.length)}%
              </div>
              <p className="text-xs text-muted-foreground">+3% desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tiendas en Mantenimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storesData.filter((s) => s.status === "maintenance").length}</div>
              <p className="text-xs text-muted-foreground">-1 desde la semana pasada</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
