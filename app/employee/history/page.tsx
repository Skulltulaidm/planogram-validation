import { EmployeeHistoryView } from "@/components/employee-history-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Historial de Validaciones | Portal de Empleado",
  description: "Historial de validaciones de planogramas realizadas",
}

export default function EmployeeHistoryPage() {
  return <EmployeeHistoryView />
}
