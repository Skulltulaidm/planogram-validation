// app/tiendas/StoreMap.tsx
"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Loader2 } from 'lucide-react'
import type { Database } from "@/lib/supabase/database.types"

// Configurar API key de Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY || ''

// Definir el tipo para las tiendas
type Store = Database['public']['Tables']['stores']['Row'] & {
    manager_name?: string
}

export default function StoreMap({ stores }: { stores: Store[] }) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Inicializar el mapa solo si no existe
        if (!map.current && mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-99.1332, 19.4326], // Centrar en Ciudad de México por defecto
                zoom: 9
            })

            // Eventos de carga del mapa
            map.current.on('load', () => {
                setLoading(false)
            })
        }

        // Función para geocodificar direcciones y agregar marcadores
        async function addStoreMarkers() {
            if (!map.current) return

            // Limpiar marcadores existentes
            document.querySelectorAll('.mapboxgl-marker').forEach(el => el.remove())

            // Para cada tienda, geocodificar y agregar un marcador
            for (const store of stores) {
                try {
                    // Normalmente harías una petición a un servicio de geocodificación
                    // Aquí simularemos con coordenadas aleatorias cerca de CDMX para demostración
                    const lat = 19.4326 + (Math.random() - 0.5) * 0.1
                    const lng = -99.1332 + (Math.random() - 0.5) * 0.1

                    // Crear un elemento personalizado para el marcador
                    const el = document.createElement('div')
                    el.className = 'store-marker'
                    el.style.width = '25px'
                    el.style.height = '25px'
                    el.style.borderRadius = '50%'

                    // Asignar color según el estado
                    if (store.status === 'active') {
                        el.style.backgroundColor = 'rgba(34, 197, 94, 0.8)' // Verde semi-transparente
                    } else if (store.status === 'maintenance') {
                        el.style.backgroundColor = 'rgba(234, 179, 8, 0.8)' // Amarillo semi-transparente
                    } else {
                        el.style.backgroundColor = 'rgba(107, 114, 128, 0.8)' // Gris semi-transparente
                    }

                    el.style.border = '2px solid white'
                    el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)'

                    // Crear popup con información
                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px; font-weight: 600;">${store.name}</h3>
              <p style="margin: 0 0 5px;">${store.address}</p>
              <p style="margin: 0 0 5px;">Región: ${store.region}</p>
              <p style="margin: 0;">Cumplimiento: ${store.compliance}%</p>
            </div>
          `)

                    // Añadir marcador al mapa
                    new mapboxgl.Marker(el)
                        .setLngLat([lng, lat])
                        .setPopup(popup)
                        .addTo(map.current)
                } catch (error) {
                    console.error(`Error al geocodificar ${store.name}:`, error)
                }
            }
        }

        if (map.current && !loading) {
            addStoreMarkers()
        }
    }, [stores, loading])

    return (
        <div className="relative h-[500px] w-full rounded-md overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/10 z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}
            <div ref={mapContainer} className="h-full w-full" />
        </div>
    )
}