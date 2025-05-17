import MobileAppView from "@/components/mobile-app-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "App Móvil | Sistema de Validación de Planogramas",
  description: "Aplicación móvil para empleados de tienda",
}

export default function MobileAppPage() {
  return <MobileAppView />
}
