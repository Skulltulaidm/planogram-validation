"use client"

import { useState } from "react"
import Link from "next/link"
import { Store, Menu, X, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "@/components/auth/logout-button"
import { useUser } from "@/hooks/use-user"

export function SupervisorNav() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const { user, profile } = useUser()

  // Obtener las iniciales del nombre para el avatar
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    }
    return "U"
  }

  return (
    <div className="border-b bg-oxxo-red">
      <div className="flex h-16 items-center px-4">
        <Store className="h-6 w-6 mr-2 text-white" />
        <h1 className="text-xl font-bold text-white">PlanoVista</h1>

        {isMobile ? (
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
              <div className="mt-8 flex flex-col space-y-4">
                <div className="flex items-center p-2 rounded-lg bg-muted">
                  <Avatar className="h-9 w-9 mr-2">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{`${profile?.first_name} ${profile?.last_name}`}</p>
                    <p className="text-xs text-muted-foreground">Supervisor</p>
                  </div>
                </div>
                <nav className="flex flex-col space-y-1">
                  <Link
                    href="/supervisor/dashboard"
                    className="text-sm font-medium transition-colors hover:text-oxxo-red px-2 py-1 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/supervisor/stores"
                    className="text-sm font-medium transition-colors hover:text-oxxo-red px-2 py-1 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Tiendas
                  </Link>
                  <Link
                    href="/supervisor/planograms"
                    className="text-sm font-medium transition-colors hover:text-oxxo-red px-2 py-1 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Planogramas
                  </Link>
                  <Link
                    href="/supervisor/reports"
                    className="text-sm font-medium transition-colors hover:text-oxxo-red px-2 py-1 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Reportes
                  </Link>
                  <Link
                    href="/supervisor/settings"
                    className="text-sm font-medium transition-colors hover:text-oxxo-red px-2 py-1 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Configuración
                  </Link>
                </nav>
                <div className="flex flex-col space-y-1 pt-4 border-t">
                  <LogoutButton className="text-sm font-medium text-muted-foreground transition-colors hover:text-oxxo-red px-2 py-1 rounded-md flex items-center justify-start" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
              <Link
                href="/supervisor/dashboard"
                className="text-sm font-medium text-white transition-colors hover:text-white/80"
              >
                Dashboard
              </Link>
              <Link
                href="/supervisor/stores"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Tiendas
              </Link>
              <Link
                href="/supervisor/planograms"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Planogramas
              </Link>
              <Link
                href="/supervisor/reports"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Reportes
              </Link>
            </nav>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white text-oxxo-red">{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{`${profile?.first_name} ${profile?.last_name}`}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
