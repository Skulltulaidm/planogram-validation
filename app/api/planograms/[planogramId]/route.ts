import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// Tipo para los productos del planograma
interface PlanogramProduct {
    CB: string
    Producto: string
    Charola: number
    "Posicion en Charola": number
    "Cantidad de Frentes": number
}

export async function GET(
    request: NextRequest,
    { params }: { params: { planogramId: string } }
) {
    try {
        const supabase = await createServerClient()

        // Obtener planograma básico
        const { data: planogram, error: planogramError } = await supabase
            .from("planograms")
            .select("*")
            .eq("id", params.planogramId)
            .single()

        if (planogramError || !planogram) {
            return NextResponse.json(
                { error: "No se encontró el planograma" },
                { status: 404 }
            )
        }

        // Aquí deberías obtener los productos del planograma desde una tabla adicional
        // Por ejemplo, una tabla "planogram_products"
        // Esta es una implementación de ejemplo, deberás adaptarla a tu estructura de datos

        // Simulación de productos (en producción, obtén estos datos de la base de datos)
        const productos: PlanogramProduct[] = [
            {
                "CB": "7501045403014",
                "Producto": "Coca-Cola 600ml",
                "Charola": 1,
                "Posicion en Charola": 1,
                "Cantidad de Frentes": 3
            },
            {
                "CB": "7501055901227",
                "Producto": "Sprite 600ml",
                "Charola": 1,
                "Posicion en Charola": 4,
                "Cantidad de Frentes": 2
            },
            {
                "CB": "7501034758236",
                "Producto": "Fanta Naranja 600ml",
                "Charola": 2,
                "Posicion en Charola": 1,
                "Cantidad de Frentes": 2
            },
            {
                "CB": "7501064193108",
                "Producto": "Agua Ciel 1L",
                "Charola": 2,
                "Posicion en Charola": 3,
                "Cantidad de Frentes": 3
            },
            {
                "CB": "7501014535202",
                "Producto": "Powerade Azul 600ml",
                "Charola": 3,
                "Posicion en Charola": 1,
                "Cantidad de Frentes": 2
            },
            {
                "CB": "7501014535301",
                "Producto": "Powerade Rojo 600ml",
                "Charola": 3,
                "Posicion en Charola": 3,
                "Cantidad de Frentes": 2
            }
        ]

        // Combinar información básica del planograma con sus productos
        const planogramData = {
            ...planogram,
            productos
        }

        return NextResponse.json(planogramData)
    } catch (error) {
        console.error("Error al obtener datos del planograma:", error)
        return NextResponse.json(
            { error: "Error al obtener datos del planograma" },
            { status: 500 }
        )
    }
}