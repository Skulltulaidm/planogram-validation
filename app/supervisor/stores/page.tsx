import StoresView from "@/components/stores-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tiendas | Sistema de Validación de Planogramas",
  description: "Gestión de tiendas en el sistema de validación de planogramas con IA",
}

export default function SupervisorStoresPage() {
  return <StoresView />
}
