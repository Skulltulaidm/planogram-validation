"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle, Home, List, Menu, Package, Settings, ShoppingBag, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function MobileAppView() {
  const [scanMode, setScanMode] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)

  const handleScan = () => {
    setScanMode(true)
    // Simulación de escaneo
    setTimeout(() => {
      setScanComplete(true)
      setScanMode(false)
    }, 2000)
  }

  const resetScan = () => {
    setScanComplete(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2" />
          <h1 className="text-lg font-bold">PlanogramAI</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-6">
              <Button variant="ghost" className="justify-start">
                <Home className="mr-2 h-5 w-5" />
                Inicio
              </Button>
              <Button variant="ghost" className="justify-start">
                <List className="mr-2 h-5 w-5" />
                Mis Tareas
              </Button>
              <Button variant="ghost" className="justify-start">
                <Package className="mr-2 h-5 w-5" />
                Inventario
              </Button>
              <Button variant="ghost" className="justify-start">
                <Settings className="mr-2 h-5 w-5" />
                Configuración
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 p-4">
        {scanMode ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-lg mb-4 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-dashed border-white rounded-lg m-4"></div>
              <div className="text-white">Escaneando planograma...</div>
            </div>
            <Button variant="outline" onClick={() => setScanMode(false)}>
              Cancelar
            </Button>
          </div>
        ) : scanComplete ? (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Resultado del Análisis</CardTitle>
                  <Badge>Sección: Bebidas</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium">Cumplimiento</div>
                  <div className="text-sm font-medium">75%</div>
                </div>
                <Progress value={75} className="h-2 mb-6" />

                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Productos faltantes</h4>
                        <p className="text-sm text-gray-600">Agua Mineral 1L - 3 unidades</p>
                        <p className="text-sm text-gray-600">Refresco Cola 2L - 2 unidades</p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Inventario disponible
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start">
                      <X className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Productos mal ubicados</h4>
                        <p className="text-sm text-gray-600">Jugo de Naranja 1L - Posición incorrecta</p>
                        <p className="text-sm text-gray-600">Agua con Gas 500ml - Posición incorrecta</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetScan}>
                  Volver
                </Button>
                <Button>Corregir Ahora</Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bienvenido, Juan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">Tienes 3 tareas pendientes para hoy</div>
                <Button className="w-full" onClick={handleScan}>
                  <Camera className="mr-2 h-5 w-5" />
                  Escanear Planograma
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="tasks">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tasks">Mis Tareas</TabsTrigger>
                <TabsTrigger value="recent">Recientes</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">Verificar sección de bebidas</CardTitle>
                      <Badge>Alta</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600">
                      Revisar y corregir disposición de productos en el anaquel principal.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Iniciar
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">Reponer productos de limpieza</CardTitle>
                      <Badge>Media</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600">Reponer productos faltantes en la sección de limpieza.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Iniciar
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">Sección Lácteos</CardTitle>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Verificación completada hace 2 horas</p>
                    <div className="flex items-center">
                      <div className="text-sm font-medium mr-2">Cumplimiento:</div>
                      <Badge className="bg-green-500">98%</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">Sección Snacks</CardTitle>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Verificación completada ayer</p>
                    <div className="flex items-center">
                      <div className="text-sm font-medium mr-2">Cumplimiento:</div>
                      <Badge className="bg-green-500">95%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {!scanMode && !scanComplete && (
        <footer className="bg-white border-t p-4">
          <div className="grid grid-cols-4 gap-2">
            <Button variant="ghost" className="flex flex-col items-center h-auto py-2">
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Inicio</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center h-auto py-2">
              <List className="h-5 w-5 mb-1" />
              <span className="text-xs">Tareas</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center h-auto py-2">
              <Package className="h-5 w-5 mb-1" />
              <span className="text-xs">Inventario</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center h-auto py-2">
              <Settings className="h-5 w-5 mb-1" />
              <span className="text-xs">Ajustes</span>
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}
