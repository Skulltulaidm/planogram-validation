import Link from "next/link"
import { Store } from "lucide-react"

export function MainNav() {
  return (
    <div className="border-b bg-oxxo-red">
      <div className="flex h-16 items-center px-4">
        <Store className="h-6 w-6 mr-2 text-white" />
        <h1 className="text-xl font-bold text-white">PlanogramAI</h1>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          <Link href="/dashboard" className="text-sm font-medium text-white transition-colors hover:text-white/80">
            Dashboard
          </Link>
          <Link href="/stores" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Tiendas
          </Link>
          <Link href="/planograms" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Planogramas
          </Link>
          <Link href="/reports" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Reportes
          </Link>
          <Link href="/employee" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Empleado
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/settings" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
            Configuración
          </Link>
        </div>
      </div>
    </div>
  )
}
