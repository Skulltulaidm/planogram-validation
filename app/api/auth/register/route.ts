import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // 1. Leer los datos de la solicitud
        const body = await request.json()
        console.log('Recibidos datos:', body)

        // 2. Devolver una respuesta simple
        return NextResponse.json({
            success: true,
            message: "API funcionando correctamente"
        })
    } catch (error: any) {
        console.error('Error en API:', error)
        return NextResponse.json({
            error: error.message || 'Error desconocido'
        }, {
            status: 500
        })
    }
}

// Añadir esto para evitar el almacenamiento en caché
export const dynamic = 'force-dynamic'