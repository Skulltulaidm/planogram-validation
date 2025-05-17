import PlanogramsView from "@/components/planograms-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Planogramas | Sistema de Validación de Planogramas",
  description: "Gestión de planogramas en el sistema de validación con IA",
}

export default function SupervisorPlanogramsPage() {
  return <PlanogramsView />
}
