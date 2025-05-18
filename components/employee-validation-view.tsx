"use client"

import { useState, useEffect } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { ImageAnalyzer } from "@/components/image-analyzer"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Tipo para los puntos de análisis
interface AnalysisPoint {
  id: string
  x: number
  y: number
  type: "error" | "warning" | "success"
  message: string
  details: string
}

// Tipo para los productos del planograma
interface PlanogramProduct {
  CB: string
  Nombre: string
  Charola: string
  "Posicion en Charola": string
  "Cantidad de Frentes": string
  Altura: string
  Ancho: string
  Profundo: string
}

// Tipo para los estantes
interface Shelf {
  id: string
  name: string
}

// Tipo para el perfil de usuario
interface UserProfile {
  id: string
  first_name: string
  last_name: string
  role: "employee" | "supervisor"
}

export function EmployeeValidationView() {
  // Estado para almacenar los datos
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false)
  const [analysisPoints, setAnalysisPoints] = useState<AnalysisPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Cliente de Supabase
  const supabase = createClient()
  const { toast } = useToast()

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true)

        // Obtener usuario actual (si está autenticado)
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (!userError && user) {
          // Obtener perfil del usuario
          const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("id, first_name, last_name, role")
              .eq("id", user.id)
              .single()

          if (!profileError && profileData) {
            setUserProfile(profileData)
          }
        }

        // Crear estantes predeterminados (independientemente de si hay usuario)
        // Estos son estantes simulados basados en los datos del planograma
        const defaultShelves: Shelf[] = [
          { id: 'charola-1-3', name: 'Charolas 1-3 (Inferior)' },
          { id: 'charola-4-6', name: 'Charolas 4-6 (Media)' },
          { id: 'charola-7-9', name: 'Charolas 7-9 (Superior)' }
        ]

        setShelves(defaultShelves)
        setSelectedShelf(defaultShelves[0].id)

      } catch (err) {
        console.error("Error al cargar datos iniciales:", err)
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Manejar la subida de imágenes
  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setAnalysisComplete(false)
    setAnalysisPoints([])
  }

  // Manejar el análisis de la imagen
  const analyzeImage = async () => {
    if (!uploadedImage || !selectedShelf) {
      toast({
        title: "Error",
        description: "Selecciona un estante y sube una imagen para analizar",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAnalyzing(true)

      // Convertir la imagen base64 a un blob para enviarlo
      const base64Data = uploadedImage.split(',')[1]
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob())

      // Crear el FormData para enviar a la API de FastAPI
      const formData = new FormData()
      formData.append("store_id", "default-store")

      // No necesitamos obtener el planograma desde la API, usamos el predeterminado
      // que ya está configurado en el backend

      formData.append("shelf_id", selectedShelf)
      formData.append("image", blob, "shelf_image.jpg")

      // Enviar a la API de FastAPI
      const response = await fetch("http://localhost:8000/analyze-shelf/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al analizar la imagen")
      }

      const result = await response.json()

      // Transformar los resultados del análisis al formato que espera ImageAnalyzer
      const newAnalysisPoints: AnalysisPoint[] = []

      if (result.analysis_result && Array.isArray(result.analysis_result)) {
        result.analysis_result.forEach((item: any, index: number) => {
          // Extraer coordenadas del string "(x, y)"
          const coordsMatch = item.coordinates.match(/\((\d+),\s*(\d+)\)/)
          if (coordsMatch) {
            const x = parseInt(coordsMatch[1])
            const y = parseInt(coordsMatch[2])

            // Determinar en qué rango de charolas estamos trabajando
            const charola = parseInt(coordsMatch[2])
            let yPosition = 0

            if (selectedShelf === 'charola-1-3') {
              // Para las charolas 1-3, ajustamos las posiciones verticales
              if (charola === 1) yPosition = 83
              else if (charola === 2) yPosition = 50
              else if (charola === 3) yPosition = 17
            } else if (selectedShelf === 'charola-4-6') {
              // Para las charolas 4-6
              if (charola === 4) yPosition = 83
              else if (charola === 5) yPosition = 50
              else if (charola === 6) yPosition = 17
            } else {
              // Para las charolas 7-9
              if (charola === 7) yPosition = 83
              else if (charola === 8) yPosition = 50
              else if (charola === 9) yPosition = 17
            }

            // Calcular posición horizontal normalizada (como porcentaje del ancho)
            // Si hay 23 posiciones, dividimos el ancho en 23 partes
            const xPosition = (x / 23) * 100

            // Crear un punto de análisis
            const point: AnalysisPoint = {
              id: `point-${index}`,
              x: xPosition,
              y: yPosition,
              type: item.error_type === "empty_spot" ? "error" : "warning",
              message: item.error_type === "empty_spot"
                  ? "Producto faltante"
                  : "Producto mal colocado",
              details: item.error_type === "empty_spot"
                  ? `Esta posición (${x}, ${y}) debería tener un producto.`
                  : `El producto con código ${item.CB || 'desconocido'} no debería estar en esta posición (${x}, ${y}).`
            }

            newAnalysisPoints.push(point)
          }
        })
      }

      // Si no hay errores, agregar un punto de éxito
      if (newAnalysisPoints.length === 0) {
        newAnalysisPoints.push({
          id: "success-1",
          x: 50,
          y: 50,
          type: "success",
          message: "Planograma correcto",
          details: "Este estante cumple correctamente con el planograma establecido."
        })
      }

      setAnalysisPoints(newAnalysisPoints)
      setAnalysisComplete(true)

      // Guardar los resultados en Supabase si hay un usuario autenticado
      if (userProfile?.id) {
        await saveVerification(newAnalysisPoints)
      }

      toast({
        title: "Análisis completado",
        description: "Se ha analizado la imagen correctamente",
      })
    } catch (err) {
      console.error("Error al analizar imagen:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo analizar la imagen",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Guardar la verificación en Supabase
  const saveVerification = async (points: AnalysisPoint[]) => {
    if (!userProfile?.id || !selectedShelf || !uploadedImage) return

    try {
      // Calcular el porcentaje de cumplimiento basado en los puntos de análisis
      const errorPoints = points.filter(p => p.type === "error").length
      const warningPoints = points.filter(p => p.type === "warning").length
      const totalPoints = points.length

      // Si solo hay puntos de éxito, 100% de cumplimiento
      const compliance = totalPoints === 0 ||
      (totalPoints === 1 && points[0].type === "success")
          ? 100
          : Math.max(0, 100 - (errorPoints * 15 + warningPoints * 5))

      // Determinar el estado general
      let status: "success" | "warning" | "error" = "success"
      if (errorPoints > 0) {
        status = "error"
      } else if (warningPoints > 0) {
        status = "warning"
      }

      // Aquí se insertaría en Supabase, pero como no tenemos una tabla específica
      // para este planograma predeterminado, simplemente registramos el resultado
      console.log("Verificación completada:", {
        shelf_id: selectedShelf,
        employee_id: userProfile.id,
        compliance,
        status,
        points
      })

      // Si se requiere guardar los datos realmente, se usaría supabase.from(...).insert(...)

    } catch (err) {
      console.error("Error al guardar verificación:", err)
      toast({
        title: "Advertencia",
        description: "El análisis se completó pero hubo un error al guardar los resultados",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
        <div className="container py-10 space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
    )
  }

  if (error) {
    return (
        <div className="container py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
    )
  }

  return (
      <div className="container py-10 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Validación de Planogramas</CardTitle>
            <CardDescription>
              Verifica que los productos estén correctamente colocados según el planograma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Planograma Estándar Cargado</AlertTitle>
                <AlertDescription>
                  Se ha cargado el planograma estándar con todos los productos. Selecciona la sección del estante a validar.
                </AlertDescription>
              </Alert>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Sección de Estante</label>
                <Select
                    value={selectedShelf || ""}
                    onValueChange={setSelectedShelf}
                    disabled={shelves.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      shelves.length === 0
                          ? "No hay secciones disponibles"
                          : "Selecciona una sección"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {shelves.map((shelf) => (
                        <SelectItem key={shelf.id} value={shelf.id}>
                          {shelf.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              {!uploadedImage ? (
                  <ImageUploader onImageUpload={handleImageUpload} />
              ) : (
                  <div className="space-y-4">
                    <ImageAnalyzer
                        imageUrl={uploadedImage}
                        isAnalyzing={isAnalyzing}
                        analysisComplete={analysisComplete}
                        analysisPoints={analysisPoints}
                    />
                    <div className="flex justify-end space-x-4">
                      <Button
                          variant="outline"
                          onClick={() => {
                            setUploadedImage(null)
                            setAnalysisComplete(false)
                            setAnalysisPoints([])
                          }}
                      >
                        Cambiar imagen
                      </Button>
                      <Button
                          className="bg-oxxo-red hover:bg-oxxo-red/90"
                          onClick={analyzeImage}
                          disabled={isAnalyzing || !selectedShelf}
                      >
                        {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analizando...
                            </>
                        ) : (
                            "Analizar imagen"
                        )}
                      </Button>
                    </div>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}