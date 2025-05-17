"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/image-uploader"
import { ImageAnalyzer } from "@/components/image-analyzer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, CheckCircle } from "lucide-react"

// Tipos de estantes disponibles
const shelfTypes = [
  { id: "shelf-1", name: "Estante 1 - Bebidas" },
  { id: "shelf-2", name: "Estante 2 - Snacks" },
  { id: "shelf-3", name: "Estante 3 - Lácteos" },
  { id: "shelf-4", name: "Estante 4 - Productos de Limpieza" },
  { id: "shelf-5", name: "Estante 5 - Cuidado Personal" },
]

// Datos de ejemplo para los puntos de análisis
const sampleAnalysisPoints = [
  {
    id: "point-1",
    x: 25,
    y: 30,
    type: "error",
    message: "Producto faltante: Agua mineral 1L",
    details: "Se requieren 3 unidades según el planograma. Inventario disponible: 5 unidades.",
  },
  {
    id: "point-2",
    x: 45,
    y: 60,
    type: "warning",
    message: "Producto mal ubicado: Refresco de cola 2L",
    details: "Debe estar en la segunda repisa, no en la tercera. Por favor reubique el producto.",
  },
  {
    id: "point-3",
    x: 70,
    y: 40,
    type: "error",
    message: "Producto incorrecto: Jugo de naranja",
    details: "Este espacio debe ser ocupado por jugo de manzana según el planograma actual.",
  },
  {
    id: "point-4",
    x: 85,
    y: 75,
    type: "success",
    message: "Sección correcta: Aguas saborizadas",
    details: "Esta sección cumple correctamente con el planograma establecido.",
  },
]

export function EmployeeValidationView() {
  const [selectedShelf, setSelectedShelf] = useState<string>("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false)
  const [analysisPoints, setAnalysisPoints] = useState<any[]>([])

  // Función para manejar la carga de imágenes
  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setAnalysisComplete(false)
    setAnalysisPoints([])
  }

  // Función para iniciar el análisis de la imagen
  const startAnalysis = () => {
    if (!selectedShelf || !uploadedImage) return

    setIsAnalyzing(true)

    // Simulamos un análisis que toma tiempo
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      setAnalysisPoints(sampleAnalysisPoints)
    }, 2000)
  }

  // Función para reiniciar el proceso
  const resetProcess = () => {
    setUploadedImage(null)
    setAnalysisComplete(false)
    setAnalysisPoints([])
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Validación de Planogramas</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verificación de Planograma</CardTitle>
          <CardDescription>
            Sube una foto del estante para verificar si cumple con el planograma establecido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!uploadedImage ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecciona el tipo de estante:</label>
                <Select value={selectedShelf} onValueChange={setSelectedShelf}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar estante" />
                  </SelectTrigger>
                  <SelectContent>
                    {shelfTypes.map((shelf) => (
                      <SelectItem key={shelf.id} value={shelf.id}>
                        {shelf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ImageUploader onImageUpload={handleImageUpload} />
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    {shelfTypes.find((shelf) => shelf.id === selectedShelf)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {analysisComplete
                      ? "Análisis completado"
                      : isAnalyzing
                        ? "Analizando imagen..."
                        : "Imagen lista para análisis"}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={resetProcess}>
                  Cambiar imagen
                </Button>
              </div>

              <ImageAnalyzer
                imageUrl={uploadedImage}
                isAnalyzing={isAnalyzing}
                analysisComplete={analysisComplete}
                analysisPoints={analysisPoints}
              />

              {!analysisComplete && !isAnalyzing && (
                <Button onClick={startAnalysis} className="w-full bg-oxxo-red hover:bg-oxxo-red/90">
                  <Camera className="mr-2 h-5 w-5" />
                  Analizar Imagen
                </Button>
              )}

              {analysisComplete && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-oxxo-red p-2">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Resultado del análisis</h4>
                        <p className="text-sm text-muted-foreground">
                          Se encontraron {analysisPoints.filter((p) => p.type === "error").length} problemas y{" "}
                          {analysisPoints.filter((p) => p.type === "warning").length} advertencias
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">75%</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Instrucciones:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Haz clic en los puntos marcados para ver detalles de los problemas detectados</li>
                      <li>Corrige los problemas identificados en el estante físico</li>
                      <li>Vuelve a tomar una foto para verificar las correcciones</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Guardar Reporte
                    </Button>
                    <Button className="flex-1 bg-oxxo-red hover:bg-oxxo-red/90">Corregir y Verificar</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
