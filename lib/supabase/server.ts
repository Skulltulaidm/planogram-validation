import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Crear un cliente de Supabase para componentes del lado del servidor
export async function createClient() {
    const cookieStore = cookies()

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: async (name) => {
                    const cookie = await (await cookieStore).get(name)
                    return cookie?.value
                },
                set: async (name, value, options) => {
                    await (await cookieStore).set(name, value, options)
                },
                remove: async (name, options) => {
                    await (await cookieStore).set(name, '', { ...options, maxAge: 0 })
                },
            },
        }
    )
}