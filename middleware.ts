import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay sesión y la ruta no es la página de inicio, redirigir a la página de inicio
  if (!session && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Si hay sesión, verificar el rol del usuario
  if (session) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    // Redirigir según el rol y la ruta
    if (profile?.role === "employee" && req.nextUrl.pathname.startsWith("/supervisor")) {
      return NextResponse.redirect(new URL("/employee/dashboard", req.url))
    }

    if (profile?.role === "supervisor" && req.nextUrl.pathname.startsWith("/employee")) {
      return NextResponse.redirect(new URL("/supervisor/dashboard", req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
