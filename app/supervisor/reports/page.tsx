import ReportsView from "@/components/reports-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reportes | Sistema de Validación de Planogramas",
  description: "Reportes y análisis del sistema de validación de planogramas con IA",
}

export default function SupervisorReportsPage() {
  return <ReportsView />
}
