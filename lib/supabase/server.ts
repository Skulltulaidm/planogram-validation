import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Crear un cliente de Supabase para componentes del lado del servidor
export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
