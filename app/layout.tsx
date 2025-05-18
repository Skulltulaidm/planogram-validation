import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PlanoHUB",
  description: "Sistema de validación de planogramas con IA para tiendas OXXO"
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
      {children}
      <Toaster />
      </body>
      </html>
  )
}