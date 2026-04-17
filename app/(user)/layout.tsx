"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/Header"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // TODO: Replace with actual auth state
  const isLoggedIn = false
  const isWaitingRoom = false
  
  // Landing page has transparent header
  const isLandingPage = pathname === "/"

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} transparent={isLandingPage} />
      {children}
    </div>
  )
}
