// app/components/reports-view/index.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/lib/supabase/database.types"

// Definir tipos
type Report = Database["public"]["Tables"]["reports"]["Row"]
type ScheduledReport = Database["public"]["Tables"]["scheduled_reports"]["Row"]
type ReportTemplate = Database["public"]["Tables"]["report_templates"]["Row"]

// Tipo para métricas
type ReportMetrics = {
    reportsThisMonth: number
    scheduledReportsCount: number
    nextReportDate: string | null
    templatesCount: number
}

export default function ReportsView() {
    // Estados para los datos
    const [reports, setReports] = useState<Report[]>([])
    const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([])
    const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([])
    const [metrics, setMetrics] = useState<ReportMetrics>({
        reportsThisMonth: 0,
        scheduledReportsCount: 0,
        nextReportDate: null,
        templatesCount: 0
    })

    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    // Estados para carga y errores
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    // Toast para notificaciones
    const { toast } = useToast()

    // Obtener tipos únicos de reportes para el filtro
    const [reportTypes, setReportTypes] = useState<string[]>([])

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchData()
    }, [])

    // Función para obtener datos
    async function fetchData() {
        try {
            setLoading(true)
            const supabase = createClient()

            // Obtener reportes
            const { data: reportsData, error: reportsError } = await supabase
                .from('reports')
                .select('*')
                .order('last_generated', { ascending: false })

            if (reportsError) {
                throw new Error(`Error cargando reportes: ${reportsError.message}`)
            }

            // Obtener reportes programados
            const { data: scheduledData, error: scheduledError } = await supabase
                .from('scheduled_reports')
                .select('*')
                .order('next_run', { ascending: true })

            if (scheduledError) {
                throw new Error(`Error cargando reportes programados: ${scheduledError.message}`)
            }

            // Obtener plantillas de reportes
            const { data: templatesData, error: templatesError } = await supabase
                .from('report_templates')
                .select('*')

            if (templatesError) {
                throw new Error(`Error cargando plantillas: ${templatesError.message}`)
            }

            // Actualizar estados
            setReports(reportsData || [])
            setScheduledReports(scheduledData || [])
            setReportTemplates(templatesData || [])

            // Extraer tipos únicos para el filtro
            if (reportsData) {
                const types = Array.from(new Set(reportsData.map(report => report.type)))
                setReportTypes(types)
            }

            // Calcular métricas
            if (reportsData && scheduledData && templatesData) {
                // Obtener fecha actual y primer día del mes
                const now = new Date()
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

                // Reportes generados este mes
                const reportsThisMonth = reportsData.filter(report =>
                    new Date(report.last_generated) >= firstDayOfMonth &&
                    report.status === "completed"
                ).length

                // Próxima fecha de reporte programado
                const nextReportDate = scheduledData.length > 0
                    ? scheduledData.reduce((earliest, report) =>
                            new Date(report.next_run) < new Date(earliest)
                                ? report.next_run
                                : earliest,
                        scheduledData[0].next_run)
                    : null

                setMetrics({
                    reportsThisMonth,
                    scheduledReportsCount: scheduledData.length,
                    nextReportDate,
                    templatesCount: templatesData.length
                })
            }

            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    // Función para generar reporte
    async function generateReport(templateId: string, format: string) {
        try {
            setIsGenerating(true)

            const response = await fetch('/api/reports/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    templateId,
                    format,
                    parameters: {
                        frequency: 'one-time'
                    }
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al generar el reporte')
            }

            // Recargar datos después de generar un nuevo reporte
            await fetchData()

            // Mostrar notificación de éxito
            toast({
                title: "Reporte generado con éxito",
                description: `Puedes descargar "${data.report.name}" desde la lista de reportes recientes.`,
                variant: "default",
            })

            // Redireccionar a la pestaña de reportes recientes
            document.querySelector('[value="recent"]')?.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            )

        } catch (error) {
            console.error('Error al generar reporte:', error)
            toast({
                title: "Error al generar el reporte",
                description: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    // Función para descargar reporte
    async function downloadReport(reportId: string) {
        try {
            const supabase = createClient()
            const { data: report, error } = await supabase
                .from('reports')
                .select('*')
                .eq('id', reportId)
                .single()

            if (error || !report) {
                throw new Error('Reporte no encontrado')
            }

            // Obtener la URL de descarga
            const fileName = `${report.name.replace(/\s/g, '_')}_${new Date(report.last_generated).toISOString().split('T')[0]}.${report.format}`
            const path = `${new Date(report.last_generated).getFullYear()}/${new Date(report.last_generated).getMonth() + 1}/${fileName}`

            const { data } = supabase
                .storage
                .from('reports')
                .getPublicUrl(path)

            // Abrir la URL en una nueva pestaña
            window.open(data.publicUrl, '_blank')

        } catch (error) {
            console.error('Error al descargar el reporte:', error)
            toast({
                title: "Error al descargar el reporte",
                description: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
                variant: "destructive",
            })
        }
    }

    // Filtrar reportes basados en la búsqueda y filtros seleccionados
    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.type.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = typeFilter === "all" || report.type === typeFilter
        const matchesStatus = statusFilter === "all" || report.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    // Funciones para renderizar badges e íconos
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

    // Mostrar estado de carga
    if (loading) {
        return <div className="flex items-center justify-center h-screen">Cargando reportes...</div>
    }

    // Mostrar error si ocurre alguno
    if (error) {
        return <div className="flex items-center justify-center h-screen">Error: {error}</div>
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
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
                                {reportTypes.map(type => (
                                    <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </SelectItem>
                                ))}
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
                                <SelectItem value="failed">Fallidos</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Button className="w-full sm:w-auto bg-oxxo-red hover:bg-oxxo-red/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Reporte
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="recent" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="recent">Recientes</TabsTrigger>
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
                                                    {new Date(report.last_generated).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell uppercase">{report.format}</TableCell>
                                                <TableCell>{getStatusBadge(report.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {report.status === "completed" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => downloadReport(report.id)}
                                                            >
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
                                    Mostrando {filteredReports.length} de {reports.length} reportes
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

                    

                    <TabsContent value="templates" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Plantillas de Reportes</CardTitle>
                                <CardDescription>Plantillas predefinidas para generar reportes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {reportTemplates.map((template) => (
                                        <Card key={template.id}>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">{template.name}</CardTitle>
                                                <CardDescription>{template.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pb-2">
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    {getTypeIcon(template.type)}
                                                    <span className="ml-2 capitalize">{template.type}</span>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => generateReport(template.id, template.format)}
                                                    disabled={isGenerating}
                                                >
                                                    {isGenerating ? 'Generando...' : 'Generar Reporte'}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
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
                            <div className="text-2xl font-bold">{metrics.reportsThisMonth}</div>
                            <p className="text-xs text-muted-foreground">Este mes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Reportes Programados</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.scheduledReportsCount}</div>
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
                                {metrics.nextReportDate
                                    ? new Date(metrics.nextReportDate).toLocaleDateString()
                                    : "No programado"}
                            </div>
                            <p className="text-xs text-muted-foreground">Programado para ejecución</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Plantillas Disponibles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.templatesCount}</div>
                            <p className="text-xs text-muted-foreground">Para diferentes necesidades</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}