"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, History, Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Historial de verificaciones (datos de ejemplo)
const verificationHistory = [
  {
    id: "ver-1",
    date: "2023-07-01T10:30:00",
    shelfType: "Estante 1 - Bebidas",
    status: "success",
    compliance: 95,
  },
  {
    id: "ver-2",
    date: "2023-06-30T14:15:00",
    shelfType: "Estante 3 - Lácteos",
    status: "warning",
    compliance: 78,
  },
  {
    id: "ver-3",
    date: "2023-06-29T09:45:00",
    shelfType: "Estante 2 - Snacks",
    status: "error",
    compliance: 65,
  },
  {
    id: "ver-4",
    date: "2023-06-28T16:20:00",
    shelfType: "Estante 4 - Productos de Limpieza",
    status: "success",
    compliance: 92,
  },
  {
    id: "ver-5",
    date: "2023-06-27T11:10:00",
    shelfType: "Estante 5 - Cuidado Personal",
    status: "warning",
    compliance: 82,
  },
  {
    id: "ver-6",
    date: "2023-06-26T13:45:00",
    shelfType: "Estante 1 - Bebidas",
    status: "success",
    compliance: 90,
  },
  {
    id: "ver-7",
    date: "2023-06-25T09:30:00",
    shelfType: "Estante 2 - Snacks",
    status: "success",
    compliance: 88,
  },
]

export function EmployeeHistoryView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredHistory = verificationHistory.filter((item) => {
    const matchesSearch = item.shelfType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    let matchesDate = true
    const itemDate = new Date(item.date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateFilter === "today") {
      matchesDate = itemDate.toDateString() === today.toDateString()
    } else if (dateFilter === "yesterday") {
      matchesDate = itemDate.toDateString() === yesterday.toDateString()
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesDate = itemDate >= weekAgo
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Historial de Validaciones</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por tipo de estante..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="success">Exitosos</SelectItem>
              <SelectItem value="warning">Con advertencias</SelectItem>
              <SelectItem value="error">Con errores</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="yesterday">Ayer</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Verificaciones</CardTitle>
          <CardDescription>Registro de verificaciones de planogramas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center p-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No se encontraron registros</h3>
                <p className="text-sm text-muted-foreground">
                  No hay verificaciones que coincidan con los filtros seleccionados
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center">
                    <div
                      className={`mr-4 rounded-full p-2 ${
                        item.status === "success"
                          ? "bg-green-100"
                          : item.status === "warning"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                      }`}
                    >
                      {item.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : item.status === "warning" ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.shelfType}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-lg font-bold mr-4 ${
                        item.compliance >= 90
                          ? "text-green-600"
                          : item.compliance >= 75
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {item.compliance}%
                    </span>
                    <Button variant="ghost" size="icon">
                      <History className="h-5 w-5" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredHistory.length} de {verificationHistory.length} verificaciones
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Verificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verificationHistory.length}</div>
            <p className="text-xs text-muted-foreground">En los últimos 7 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verificaciones Exitosas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {verificationHistory.filter((item) => item.status === "success").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (verificationHistory.filter((item) => item.status === "success").length / verificationHistory.length) *
                  100,
              )}
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
                verificationHistory.reduce((acc, item) => acc + item.compliance, 0) / verificationHistory.length,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">+3% desde la semana pasada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verificaciones con Problemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {verificationHistory.filter((item) => item.status === "error").length}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
