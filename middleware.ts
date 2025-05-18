import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

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

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (user && !error) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

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
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}