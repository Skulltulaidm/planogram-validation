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
import {
  Search,
  FileText,
  BarChart,
  PieChart,
  LineChart,
  Download,
  Calendar,
  Clock,
  Plus,
  ArrowUpRight,
  Filter,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo
const reportsData = [
  {
    id: "report-1",
    name: "Reporte de Cumplimiento Mensual",
    type: "compliance",
    frequency: "monthly",
    lastGenerated: "2023-06-25",
    format: "pdf",
    status: "completed",
    size: "2.4 MB",
  },
  {
    id: "report-2",
    name: "Análisis de Tendencias por Categoría",
    type: "analysis",
    frequency: "quarterly",
    lastGenerated: "2023-06-15",
    format: "excel",
    status: "completed",
    size: "4.1 MB",
  },
  {
    id: "report-3",
    name: "Reporte de Incidencias por Tienda",
    type: "incidents",
    frequency: "weekly",
    lastGenerated: "2023-06-28",
    format: "pdf",
    status: "completed",
    size: "1.8 MB",
  },
  {
    id: "report-4",
    name: "Análisis de Impacto en Ventas",
    type: "sales",
    frequency: "monthly",
    lastGenerated: "2023-06-01",
    format: "excel",
    status: "completed",
    size: "3.5 MB",
  },
  {
    id: "report-5",
    name: "Reporte Ejecutivo para Gerencia",
    type: "executive",
    frequency: "monthly",
    lastGenerated: "2023-06-30",
    format: "pdf",
    status: "scheduled",
    size: "N/A",
  },
  {
    id: "report-6",
    name: "Análisis de Inventario vs. Planograma",
    type: "inventory",
    frequency: "weekly",
    lastGenerated: "2023-06-27",
    format: "excel",
    status: "processing",
    size: "N/A",
  },
]

// Datos de ejemplo para reportes programados
const scheduledReportsData = [
  {
    id: "sched-1",
    name: "Reporte Ejecutivo para Gerencia",
    type: "executive",
    frequency: "monthly",
    nextRun: "2023-07-30",
    recipients: ["gerencia@empresa.com", "direccion@empresa.com"],
    format: "pdf",
  },
  {
    id: "sched-2",
    name: "Reporte de Cumplimiento Semanal",
    type: "compliance",
    frequency: "weekly",
    nextRun: "2023-07-03",
    recipients: ["supervisores@empresa.com"],
    format: "excel",
  },
  {
    id: "sched-3",
    name: "Análisis de Inventario vs. Planograma",
    type: "inventory",
    frequency: "weekly",
    nextRun: "2023-07-04",
    recipients: ["inventario@empresa.com", "operaciones@empresa.com"],
    format: "excel",
  },
]

export default function ReportsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const isMobile = useIsMobile()

  const filteredReports = reportsData.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completado</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Procesando</Badge>
      case "scheduled":
        return <Badge className="bg-yellow-500">Programado</Badge>
      case "failed":
        return <Badge className="bg-red-500">Fallido</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4 text-oxxo-red" />
      case "excel":
        return <BarChart className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "compliance":
        return <PieChart className="h-4 w-4" />
      case "analysis":
        return <LineChart className="h-4 w-4" />
      case "incidents":
        return <FileText className="h-4 w-4" />
      case "sales":
        return <BarChart className="h-4 w-4" />
      case "executive":
        return <FileText className="h-4 w-4" />
      case "inventory":
        return <BarChart className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile ? <MobileNav /> : <MainNav />}
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
          <UserNav />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar reportes..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="compliance">Cumplimiento</SelectItem>
                <SelectItem value="analysis">Análisis</SelectItem>
                <SelectItem value="incidents">Incidencias</SelectItem>
                <SelectItem value="sales">Ventas</SelectItem>
                <SelectItem value="executive">Ejecutivo</SelectItem>
                <SelectItem value="inventory">Inventario</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="scheduled">Programados</SelectItem>
                <SelectItem value="failed">Fallidos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Más Filtros
            </Button>
            <Button className="w-full sm:w-auto bg-oxxo-red hover:bg-oxxo-red/90">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Reporte
            </Button>
          </div>
        </div>

        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recientes</TabsTrigger>
            <TabsTrigger value="scheduled">Programados</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Reportes Recientes</CardTitle>
                <CardDescription>
                  Total: {filteredReports.length} reportes {searchTerm && "encontrados"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden md:table-cell">Tipo</TableHead>
                      <TableHead className="hidden md:table-cell">Generado</TableHead>
                      <TableHead className="hidden md:table-cell">Formato</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getTypeIcon(report.type)}
                            <span className="ml-2">{report.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell capitalize">{report.type}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(report.lastGenerated).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell uppercase">{report.format}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {report.status === "completed" && (
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Descargar</span>
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="text-oxxo-red">
                              <ArrowUpRight className="h-4 w-4" />
                              <span className="sr-only">Ver detalles</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredReports.length} de {reportsData.length} reportes
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

          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reportes Programados</CardTitle>
                <CardDescription>Reportes configurados para generación automática</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden md:table-cell">Tipo</TableHead>
                      <TableHead className="hidden md:table-cell">Frecuencia</TableHead>
                      <TableHead>Próxima Ejecución</TableHead>
                      <TableHead className="hidden md:table-cell">Formato</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReportsData.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getTypeIcon(report.type)}
                            <span className="ml-2">{report.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell capitalize">{report.type}</TableCell>
                        <TableCell className="hidden md:table-cell capitalize">{report.frequency}</TableCell>
                        <TableCell>{new Date(report.nextRun).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden md:table-cell uppercase">{report.format}</TableCell>
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
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Reportes</CardTitle>
                <CardDescription>Plantillas predefinidas para generar reportes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Reporte de Cumplimiento</CardTitle>
                      <CardDescription>Análisis detallado del cumplimiento de planogramas</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <PieChart className="h-4 w-4 mr-2" />
                        <span>Incluye gráficos y tablas comparativas</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Generar Reporte
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Análisis de Tendencias</CardTitle>
                      <CardDescription>Evolución del cumplimiento a lo largo del tiempo</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <LineChart className="h-4 w-4 mr-2" />
                        <span>Gráficos de tendencias y proyecciones</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Generar Reporte
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Reporte Ejecutivo</CardTitle>
                      <CardDescription>Resumen para gerencia con KPIs principales</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Formato conciso con insights clave</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Generar Reporte
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.filter((r) => r.status === "completed").length}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reportes Programados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledReportsData.length}</div>
              <p className="text-xs text-muted-foreground">Activos actualmente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Próximo Reporte</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(
                  Math.min(...scheduledReportsData.map((r) => new Date(r.nextRun).getTime())),
                ).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">Programado para ejecución</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Plantillas Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Para diferentes necesidades</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
