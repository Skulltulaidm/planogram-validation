"use client"

import { useState } from "react"
import Link from "next/link"
import { Store, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b bg-oxxo-red">
      <div className="flex h-16 items-center px-4">
        <Store className="h-6 w-6 mr-2 text-white" />
        <h1 className="text-xl font-bold text-white">PlanogramAI</h1>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto text-white hover:bg-oxxo-red/90">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex items-center">
              <Store className="h-6 w-6 mr-2 text-oxxo-red" />
              <h1 className="text-xl font-bold text-oxxo-red">PlanogramAI</h1>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Cerrar menú</span>
              </Button>
            </div>
            <nav className="mt-8 flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-oxxo-red"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/stores"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-oxxo-red"
                onClick={() => setOpen(false)}
              >
                Tiendas
              </Link>
              <Link
                href="/planograms"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-oxxo-red"
                onClick={() => setOpen(false)}
              >
                Planogramas
              </Link>
              <Link
                href="/reports"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-oxxo-red"
                onClick={() => setOpen(false)}
              >
                Reportes
              </Link>
              <Link
                href="/employee"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-oxxo-red"
                onClick={() => setOpen(false)}
              >
                Empleado
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-oxxo-red"
                onClick={() => setOpen(false)}
              >
                Configuración
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
