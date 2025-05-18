// app/employee/validation/page.tsx
import { EmployeeValidationView } from "@/components/employee-validation-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Validación de Planogramas | Portal de Empleado",
  description: "Herramienta para validar planogramas con IA",
}

export default function EmployeeValidationPage() {
  return <EmployeeValidationView />
}