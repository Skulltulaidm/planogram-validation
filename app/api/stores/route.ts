import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from('stores')
        .select('*, profiles:manager_id(first_name, last_name)')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validar datos aquí

        const { data, error } = await supabaseAdmin
            .from('stores')
            .insert([body])
            .select()

        if (error) throw error

        return NextResponse.json(data[0], { status: 201 })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Error al crear tienda' },
            { status: 400 }
        )
    }
}