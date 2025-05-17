import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function EmployeeDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido, Juan</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Para completar hoy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+5% desde la semana pasada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última Verificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Hace 2 horas</div>
            <p className="text-xs text-muted-foreground">Estante 1 - Bebidas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tareas Pendientes</CardTitle>
          <CardDescription>Tareas asignadas para completar hoy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-yellow-100 p-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">Verificar Estante 1 - Bebidas</h3>
                  <p className="text-sm text-muted-foreground">Prioridad: Alta</p>
                </div>
              </div>
              <Badge>09:30 AM</Badge>
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/employee/validation">
                <Button className="bg-oxxo-red hover:bg-oxxo-red/90">
                  <Camera className="mr-2 h-4 w-4" />
                  Verificar Ahora
                </Button>
              </Link>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-100 p-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Verificar Estante 3 - Lácteos</h3>
                  <p className="text-sm text-muted-foreground">Prioridad: Media</p>
                </div>
              </div>
              <Badge>11:00 AM</Badge>
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/employee/validation">
                <Button variant="outline">Verificar</Button>
              </Link>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-blue-100 p-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Verificar Estante 2 - Snacks</h3>
                  <p className="text-sm text-muted-foreground">Prioridad: Media</p>
                </div>
              </div>
              <Badge>02:00 PM</Badge>
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/employee/validation">
                <Button variant="outline">Verificar</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verificaciones Recientes</CardTitle>
          <CardDescription>Últimas verificaciones realizadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-green-100 p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Estante 4 - Productos de Limpieza</h3>
                  <p className="text-sm text-muted-foreground">Hace 1 día</p>
                </div>
              </div>
              <Badge className="bg-green-500">92%</Badge>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-yellow-100 p-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">Estante 2 - Snacks</h3>
                  <p className="text-sm text-muted-foreground">Hace 2 días</p>
                </div>
              </div>
              <Badge className="bg-yellow-500">78%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
