// app/employee/dashboard/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle, AlertCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { TasksService } from "@/lib/services/tasks-service"
import { VerificationsService } from "@/lib/services/verifications-service"
import { ComplianceService } from "@/lib/services/compliance-services"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default async function EmployeeDashboard() {
  // Initialize Supabase client
  const supabase = await createClient()
  
  // Get current user data
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    // Handle not authenticated state
    return (
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold">No has iniciado sesión</h2>
        <p className="mt-2">Por favor inicia sesión para ver tu dashboard.</p>
      </div>
    )
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()
  
  const userName = profile?.first_name || "Empleado"
  
  // Get pending tasks
  const pendingTasks = await TasksService.getPendingTasks(user.id)
  const pendingTasksCount = pendingTasks.length
  
  // Get user verifications
  const userVerifications = await VerificationsService.getEmployeeVerifications(user.id)
  
  // Get compliance trend data
  const { trend: complianceTrend, currentCompliance } = await ComplianceService.getComplianceTrend(user.id)
  const isPositiveTrend = complianceTrend.startsWith('+')
  
  // Get latest verification
  const latestVerification = userVerifications[0]
  let latestVerificationTime = "Sin verificaciones"
  let latestVerificationShelf = ""
  
  if (latestVerification) {
    const shelf = latestVerification.shelves
    latestVerificationTime = `Hace ${formatDistanceToNow(new Date(latestVerification.created_at), { locale: es })}`
    latestVerificationShelf = shelf ? shelf.name : "Desconocido"
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido, {userName}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground">Para completar hoy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCompliance}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {isPositiveTrend ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={isPositiveTrend ? "text-green-500" : "text-red-500"}>
                {complianceTrend}
              </span>
              <span className="ml-1">desde la semana pasada</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última Verificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestVerificationTime}</div>
            <p className="text-xs text-muted-foreground">{latestVerificationShelf}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tareas Pendientes</CardTitle>
          <CardDescription>Tareas asignadas para completar hoy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No tienes tareas pendientes para hoy
            </div>
          ) : (
            pendingTasks.map((task) => {
              const isPriorityHigh = task.priority === "high"
              const shelf = task.shelves
              const shelfName = shelf ? shelf.name : "Desconocido"
              const scheduledTime = task.scheduled_time 
                ? new Date(task.scheduled_time).toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }) 
                : "Sin programar"

              return (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className={`mr-4 rounded-full ${isPriorityHigh ? 'bg-yellow-100' : 'bg-blue-100'} p-2`}>
                        {isPriorityHigh ? (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Prioridad: {isPriorityHigh ? 'Alta' : task.priority === "medium" ? 'Media' : 'Baja'}
                        </p>
                      </div>
                    </div>
                    <Badge>{scheduledTime}</Badge>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/employee/validation?task=${task.id}`}>
                      <Button className={isPriorityHigh ? "bg-oxxo-red hover:bg-oxxo-red/90" : ""} variant={isPriorityHigh ? "default" : "outline"}>
                        {isPriorityHigh && <Camera className="mr-2 h-4 w-4" />}
                        Verificar{isPriorityHigh ? " Ahora" : ""}
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verificaciones Recientes</CardTitle>
          <CardDescription>Últimas verificaciones realizadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userVerifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No tienes verificaciones recientes
            </div>
          ) : (
            userVerifications.slice(0, 2).map((verification) => {
              const shelf = verification.shelves
              const shelfName = shelf ? shelf.name : "Desconocido"
              const createdAt = new Date(verification.created_at)
              const timeAgo = formatDistanceToNow(createdAt, { locale: es, addSuffix: false })
              const isSuccess = verification.status === "success"
              const isWarning = verification.status === "warning"

              return (
                <div key={verification.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className={`mr-4 rounded-full ${
                        isSuccess ? 'bg-green-100' : isWarning ? 'bg-yellow-100' : 'bg-red-100'
                      } p-2`}>
                        {isSuccess ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className={`h-5 w-5 ${
                            isWarning ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{shelfName}</h3>
                        <p className="text-sm text-muted-foreground">Hace {timeAgo}</p>
                      </div>
                    </div>
                    <Badge className={`${
                      isSuccess ? 'bg-green-500' : isWarning ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {verification.compliance}%
                    </Badge>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}