"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Camera, X } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string, file: File) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Verificar que sea una imagen
    if (!file.type.match("image.*")) {
      alert("Por favor, sube una imagen válida")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setPreviewUrl(e.target.result)
        onImageUpload(e.target.result, file) // Ahora también pasamos el archivo
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
      <div className="space-y-4">
        {!previewUrl ? (
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isDragging ? "border-oxxo-red bg-oxxo-red/5" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sube una imagen del estante</h3>
                  <p className="text-sm text-muted-foreground">
                    Arrastra y suelta una imagen aquí o haz clic para seleccionar
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Seleccionar Archivo
                  </Button>
                  {/* <Button className="bg-oxxo-red hover:bg-oxxo-red/90" onClick={handleCameraClick}>
                    <Camera className="mr-2 h-5 w-5" />
                    Tomar Foto
                  </Button> */}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    capture="environment"
                />
                <p className="text-xs text-muted-foreground">Formatos soportados: JPG, PNG, GIF (máx. 10MB)</p>
              </div>
            </div>
        ) : (
            <Card>
              <CardContent className="p-2 relative">
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 z-10 rounded-full"
                    onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img src={previewUrl || "/placeholder.svg"} alt="Vista previa" className="w-full h-auto rounded-md" />
              </CardContent>
            </Card>
        )}
      </div>
  )
}