"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface LogoutButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function LogoutButton({ children, className, variant = "ghost" }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Cerrar sesión
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Redirigir al inicio - usar window.location.href en lugar de router
      window.location.href = "/"
    } catch (error: any) {
      toast({
        title: "Error al cerrar sesión",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
      <Button variant={variant} className={className} onClick={handleLogout} disabled={isLoading}>
        {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              {children || "Cerrar Sesión"}
            </>
        )}
      </Button>
  )
}