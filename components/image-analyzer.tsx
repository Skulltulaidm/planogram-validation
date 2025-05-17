"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AnalysisPoint {
  id: string
  x: number
  y: number
  type: "error" | "warning" | "success"
  message: string
  details: string
}

interface ImageAnalyzerProps {
  imageUrl: string
  isAnalyzing: boolean
  analysisComplete: boolean
  analysisPoints: AnalysisPoint[]
}

export function ImageAnalyzer({ imageUrl, isAnalyzing, analysisComplete, analysisPoints }: ImageAnalyzerProps) {
  const [selectedPoint, setSelectedPoint] = useState<AnalysisPoint | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handlePointClick = (point: AnalysisPoint) => {
    setSelectedPoint(point)
    setDialogOpen(true)
  }

  const getPointIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-white" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-white" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-white" />
      default:
        return <AlertCircle className="h-4 w-4 text-white" />
    }
  }

  const getPointColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500 hover:bg-red-600"
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "success":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <div className="relative">
      <Card>
        <CardContent className="p-2 relative">
          <div className="relative">
            <img src={imageUrl || "/placeholder.svg"} alt="Imagen para análisis" className="w-full h-auto rounded-md" />

            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                <div className="flex flex-col items-center text-white">
                  <Loader2 className="h-12 w-12 animate-spin mb-2" />
                  <p>Analizando imagen...</p>
                </div>
              </div>
            )}

            {analysisComplete &&
              analysisPoints.map((point) => (
                <TooltipProvider key={point.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110 ${getPointColor(
                          point.type,
                        )}`}
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onClick={() => handlePointClick(point)}
                      >
                        {getPointIcon(point.type)}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{point.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center">
              {selectedPoint && (
                <div
                  className={`mr-2 p-1 rounded-full ${
                    selectedPoint.type === "error"
                      ? "bg-red-500"
                      : selectedPoint.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                >
                  {getPointIcon(selectedPoint.type)}
                </div>
              )}
              <DialogTitle>{selectedPoint?.message}</DialogTitle>
            </div>
            <DialogDescription>{selectedPoint?.details}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Acción recomendada:</h4>
              <p className="text-sm">
                {selectedPoint?.type === "error"
                  ? "Corregir inmediatamente para cumplir con el planograma."
                  : selectedPoint?.type === "warning"
                    ? "Revisar y ajustar cuando sea posible."
                    : "Esta sección cumple correctamente con el planograma."}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-oxxo-red hover:bg-oxxo-red/90 text-white px-4 py-2 rounded-md"
                onClick={() => setDialogOpen(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
