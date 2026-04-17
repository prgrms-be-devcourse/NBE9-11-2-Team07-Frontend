"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"

function UserLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isLoggedIn } = useAuth()
  
  // Landing page has transparent header
  const isLandingPage = pathname === "/"

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} transparent={isLandingPage} />
      {children}
    </div>
  )
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <UserLayoutContent>{children}</UserLayoutContent>
    </AuthProvider>
  )
}
