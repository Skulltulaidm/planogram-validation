import type React from "react"
import { EmployeeNav } from "@/components/employee-nav"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal de Empleado | Sistema de Validación de Planogramas",
  description: "Portal para empleados de tienda para validación de planogramas",
}

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <EmployeeNav />
      <div className="flex-1">{children}</div>
    </div>
  )
}
