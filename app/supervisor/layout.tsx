import type React from "react"
import { SupervisorNav } from "@/components/supervisor-nav"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal de Supervisor | Sistema de Validación de Planogramas",
  description: "Portal para supervisores del sistema de validación de planogramas",
}

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SupervisorNav />
      <div className="flex-1">{children}</div>
    </div>
  )
}
