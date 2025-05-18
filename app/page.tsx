import { AuthForm } from "@/components/auth/auth-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (user && !error) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
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