import type { Metadata } from "next"
import { VerificationsService, VerificationWithDetails } from "@/lib/services/verifications-service"
import { format, parseISO } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Historial de Validaciones | Portal de Empleado",
  description: "Historial de validaciones de planogramas realizadas",
}

export default async function EmployeeHistoryPage() {
  // Obtener el usuario actual usando el cliente de Supabase del servidor
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error("Error getting user:", userError)
    // Redirigir al login si no hay usuario
    redirect("/auth/login")
  }
  
  // Usar el ID del usuario actual
  const userId = user.id
  
  // Obtener las verificaciones del usuario
  const verifications = await VerificationsService.getEmployeeVerificationHistory(userId)
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Historial de Validaciones</h1>
        <p className="text-muted-foreground mt-2">
          Revisa todas tus validaciones de planogramas realizadas.
        </p>
      </div>
      
      {verifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-background">
          <div className="rounded-full bg-muted p-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">No hay validaciones</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Aún no has realizado ninguna validación de planogramas.
          </p>
          <Link
            href="/app/employee"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {verifications.map((verification) => (
            <VerificationCard key={verification.id} verification={verification} />
          ))}
        </div>
      )}
    </div>
  )
}

function VerificationCard({ verification }: { verification: VerificationWithDetails }) {
  const formattedDate = format(parseISO(verification.created_at), "dd/MM/yyyy HH:mm")
  const shelf = verification.shelves
  const planogram = shelf?.planograms
  const store = shelf?.stores
  
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="p-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-xl font-semibold">
            {shelf?.name || "Estantería sin nombre"}
          </h3>
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium",
            verification.status === "success" ? "bg-green-100 text-green-800" : 
            verification.status === "warning" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          )}>
            {verification.status === "success" ? "Exitoso" : 
             verification.status === "warning" ? "Advertencia" : "Error"}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {formattedDate}
        </div>
        
        <div className="grid md:grid-cols-[1fr_200px] gap-4 mt-4">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Cumplimiento:</span>{" "}
              <span className={cn(
                verification.compliance >= 90 ? "text-green-600" : 
                verification.compliance >= 70 ? "text-yellow-600" : "text-red-600"
              )}>
                {verification.compliance}%
              </span>
            </div>
            
            {planogram && (
              <div>
                <span className="font-medium">Planograma:</span>{" "}
                {planogram.name} (v{planogram.version})
              </div>
            )}
            
            {store && (
              <div>
                <span className="font-medium">Tienda:</span>{" "}
                {store.name}, {store.city}
              </div>
            )}
            
            <div className="mt-4">
              <Link 
                href={`/app/employee/verifications/${verification.id}`}
                className="text-primary hover:underline"
              >
                Ver detalles
              </Link>
            </div>
          </div>
          
          {verification.image_url && (
            <div className="relative h-40 rounded-md overflow-hidden">
              <Image
                src={verification.image_url}
                alt="Imagen de verificación"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}