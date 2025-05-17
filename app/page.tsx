import { AuthForm } from "@/components/auth/auth-form"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Verificar si el usuario ya está autenticado
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    // Obtener el perfil del usuario para determinar su rol
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role === "employee") {
      redirect("/employee/dashboard")
    } else if (profile?.role === "supervisor") {
      redirect("/supervisor/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm />
    </div>
  )
}
