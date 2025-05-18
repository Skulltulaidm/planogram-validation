import { createClient } from '@supabase/supabase-js'
import type { Database } from "@/lib/supabase/database.types" // Ajusta la ruta si es necesario

// Este cliente solo se usa en el servidor
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)