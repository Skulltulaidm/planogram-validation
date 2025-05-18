// app/components/planograms-view/index.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, LayoutGrid, Plus, ArrowUpRight, Filter, Download, Share2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ProcessedPlanogram = {
    id: string
    name: string
    category: string
    department: string
    lastUpdated: string
    version: string
    status: string
    storeCount: number
    compliance: number
    thumbnail: string
}

type MetricsType = {
    total: number
    active: number
    draft: number
    avgCompliance: number
    changeFromLastMonth: {
        total: number
        active: number
        compliance: number
    }
}

export default function PlanogramsView() {
    const [planograms, setPlanograms] = useState<ProcessedPlanogram[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const [uniqueCategories, setUniqueCategories] = useState<string[]>([])

    // Métricas
    const [metrics, setMetrics] = useState<MetricsType>({
        total: 0,
        active: 0,
        draft: 0,
        avgCompliance: 0,
        changeFromLastMonth: {
            total: 0,
            active: 0,
            compliance: 0
        }
    })

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const supabase = createClient()

                // Obtener planogramas actuales
                const { data: currentPlanograms, error: planogramsError } = await supabase
                    .from('planograms')
                    .select('*')

                if (planogramsError) {
                    throw new Error(`Error cargando planogramas: ${planogramsError.message}`)
                }

                // Obtener relación entre tiendas y planogramas
                const { data: storePlanograms, error: storePlanogramsError } = await supabase
                    .from('store_planograms')
                    .select('*')

                if (storePlanogramsError) {
                    throw new Error(`Error cargando datos de tiendas: ${storePlanogramsError.message}`)
                }

                // Calcular fecha del mes pasado para comparaciones
                const lastMonth = new Date()
                lastMonth.setMonth(lastMonth.getMonth() - 1)
                const lastMonthStr = lastMonth.toISOString().split('T')[0]

                // Obtener planogramas del mes pasado para comparar cambios
                const { data: lastMonthPlanograms, error: lastMonthError } = await supabase
                    .from('planograms')
                    .select('*')
                    .lt('updated_at', lastMonthStr)

                if (lastMonthError) {
                    console.warn('Error al cargar datos históricos:', lastMonthError)
                    // No interrumpimos el flujo si fallan los datos históricos
                }

                // Procesar datos actuales
                const processed = currentPlanograms.map(planogram => {
                    // Filtrar las relaciones para este planograma
                    const relatedStorePlanograms = storePlanograms?.filter(
                        sp => sp.planogram_id === planogram.id
                    ) || []

                    // Calcular el número de tiendas
                    const storeCount = relatedStorePlanograms.length

                    // Calcular el cumplimiento promedio
                    const compliance = storeCount > 0
                        ? Math.round(
                            relatedStorePlanograms.reduce((acc, sp) => acc + sp.compliance, 0) / storeCount
                        )
                        : 0

                    return {
                        id: planogram.id,
                        name: planogram.name,
                        category: planogram.category,
                        department: planogram.department,
                        lastUpdated: planogram.updated_at,
                        version: planogram.version,
                        status: planogram.status,
                        storeCount,
                        compliance,
                        thumbnail: planogram.thumbnail_url || "/placeholder.svg",
                    }
                })

                // Obtener categorías únicas
                const categories = Array.from(new Set(processed.map(p => p.category)))
                setUniqueCategories(categories)

                // Calcular métricas actuales
                const currentMetrics = {
                    total: processed.length,
                    active: processed.filter(p => p.status === "active").length,
                    draft: processed.filter(p => p.status === "draft").length,
                    avgCompliance: processed.filter(p => p.compliance > 0).length > 0
                        ? Math.round(
                            processed.filter(p => p.compliance > 0)
                                .reduce((acc, p) => acc + p.compliance, 0) /
                            processed.filter(p => p.compliance > 0).length
                        )
                        : 0
                }

                // Calcular cambios desde el mes pasado
                const lastMonthMetrics = lastMonthPlanograms
                    ? {
                        total: lastMonthPlanograms.length,
                        active: lastMonthPlanograms.filter(p => p.status === "active").length,

                        // Calcular compliance histórico
                        avgCompliance: (() => {
                            // Recreamos esta parte para obtener el compliance histórico
                            const historicCompliance = lastMonthPlanograms.map(planogram => {
                                const relatedSP = storePlanograms?.filter(
                                    sp => sp.planogram_id === planogram.id
                                ) || []

                                return relatedSP.length > 0
                                    ? Math.round(
                                        relatedSP.reduce((acc, sp) => acc + sp.compliance, 0) / relatedSP.length
                                    )
                                    : 0
                            })

                            return historicCompliance.filter(c => c > 0).length > 0
                                ? Math.round(
                                    historicCompliance.filter(c => c > 0)
                                        .reduce((acc, c) => acc + c, 0) /
                                    historicCompliance.filter(c => c > 0).length
                                )
                                : 0
                        })()
                    }
                    : { total: 0, active: 0, avgCompliance: 0 }

                // Cambios desde el mes pasado
                const changeFromLastMonth = {
                    total: currentMetrics.total - lastMonthMetrics.total,
                    active: currentMetrics.active - lastMonthMetrics.active,
                    compliance: currentMetrics.avgCompliance - lastMonthMetrics.avgCompliance
                }

                // Actualizar el estado
                setPlanograms(processed)
                setMetrics({
                    ...currentMetrics,
                    changeFromLastMonth
                })
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido')
                console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Filtrar planogramas
    const filteredPlanograms = planograms.filter((planogram) => {
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

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Cargando planogramas...</div>
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen">Error: {error}</div>
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Planogramas</h2>
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
                                {uniqueCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
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
                            <div className="text-2xl font-bold">{metrics.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {metrics.changeFromLastMonth.total > 0
                                    ? `+${metrics.changeFromLastMonth.total}`
                                    : metrics.changeFromLastMonth.total} desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Planogramas Activos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.active}</div>
                            <p className="text-xs text-muted-foreground">
                                {Math.round((metrics.active / metrics.total) * 100)}% del total
                                {metrics.changeFromLastMonth.active !== 0 &&
                                    ` (${metrics.changeFromLastMonth.active > 0 ? '+' : ''}${metrics.changeFromLastMonth.active} desde el mes pasado)`}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Cumplimiento Promedio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.avgCompliance}%</div>
                            <p className="text-xs text-muted-foreground">
                                {metrics.changeFromLastMonth.compliance > 0
                                    ? `+${metrics.changeFromLastMonth.compliance}%`
                                    : `${metrics.changeFromLastMonth.compliance}%`} desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.draft}</div>
                            <p className="text-xs text-muted-foreground">Pendientes de publicación</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}