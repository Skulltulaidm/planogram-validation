import DashboardView from "@/components/dashboard-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Sistema de Validación de Planogramas",
  description: "Dashboard para supervisores del sistema de validación de planogramas con IA",
}

export default function DashboardPage() {
  return <DashboardView />
}
