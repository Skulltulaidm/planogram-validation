'use server'

import { createClient } from '@supabase/supabase-js'
import type { Database } from "@/lib/supabase/database.types"

export async function registerUser(formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "employee" | "supervisor";
}) {
    try {
        // Cliente admin solo en el servidor
        const supabaseAdmin = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        console.log('Datos recibidos en action:', formData)

        // 1. Crear el usuario en auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: formData.email,
            password: formData.password,
            email_confirm: true,
            user_metadata: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                role: formData.role
            }
        })

        if (authError) {
            console.error('Error al crear usuario:', authError)
            return { success: false, error: authError.message }
        }

        if (authData.user) {
            // 2. Crear el perfil del usuario
            const { error: profileError } = await supabaseAdmin.from("profiles").insert({
                id: authData.user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                role: formData.role
            })

            if (profileError) {
                console.error('Error al crear perfil:', profileError)
                return { success: false, error: profileError.message }
            }

            console.log('Usuario y perfil creados correctamente')
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error en registro:', error)
        return { success: false, error: error.message || 'Error desconocido' }
    }
}