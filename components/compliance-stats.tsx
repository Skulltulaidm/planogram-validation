import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, LineChart } from "lucide-react"

interface ComplianceStatsProps {
  selectedStore: string | null
}

export default function ComplianceStats({ selectedStore }: ComplianceStatsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Estadísticas de Cumplimiento</h3>
        {selectedStore && (
          <Badge variant="outline" className="ml-2">
            Filtrando por tienda
          </Badge>
        )}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="categories">Por Categoría</TabsTrigger>
          <TabsTrigger value="comparison">Comparativa</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Cumplimiento</CardTitle>
              <CardDescription>Evolución del cumplimiento de planogramas en los últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="flex flex-col items-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mb-2" />
                  <p>Gráfico de tendencia de cumplimiento</p>
                  <p className="text-sm">(Datos simulados)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cumplimiento Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">86%</div>
                <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tiempo de Corrección</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 horas</div>
                <p className="text-xs text-muted-foreground">-15% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Validaciones Diarias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+8 desde la semana pasada</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cumplimiento por Categoría</CardTitle>
              <CardDescription>Análisis del cumplimiento por categoría de productos</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="flex flex-col items-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mb-2" />
                  <p>Gráfico de cumplimiento por categoría</p>
                  <p className="text-sm">(Datos simulados)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Categorías con Mayor Cumplimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Bebidas</span>
                    <Badge className="bg-green-500">95%</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Snacks</span>
                    <Badge className="bg-green-500">92%</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Cuidado Personal</span>
                    <Badge className="bg-green-500">90%</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorías con Menor Cumplimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Productos Frescos</span>
                    <Badge className="bg-red-500">68%</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Temporada</span>
                    <Badge className="bg-red-500">72%</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Electrónica</span>
                    <Badge className="bg-yellow-500">78%</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativa entre Tiendas</CardTitle>
              <CardDescription>Análisis comparativo del cumplimiento entre tiendas</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="flex flex-col items-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mb-2" />
                  <p>Gráfico comparativo entre tiendas</p>
                  <p className="text-sm">(Datos simulados)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
