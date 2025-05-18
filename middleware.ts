import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Crear el cliente de Supabase para el middleware
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => {
            return req.cookies.get(name)?.value
          },
          set: (name, value, options) => {
            // Si el cookie existe, actualízalo
            if (req.cookies.has(name)) {
              res.cookies.set({
                name,
                value,
                ...options,
              })
            } else {
              res.cookies.set({
                name,
                value,
                ...options,
              })
            }
          },
          remove: (name, options) => {
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
  )

  // Verificar si el usuario está autenticado
  const { data: { session } } = await supabase.auth.getSession()

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