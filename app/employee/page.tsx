import EmployeeView from "@/components/employee-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vista de Empleado | Sistema de Validación de Planogramas",
  description: "Herramienta para empleados para validar planogramas con IA",
}

export default function EmployeePage() {
  return <EmployeeView />
}
