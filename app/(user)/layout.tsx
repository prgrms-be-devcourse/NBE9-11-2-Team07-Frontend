"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/Header"

function UserLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Landing page has transparent header
  const isLandingPage = pathname === "/"
  const shouldHideHeader = pathname === "/waiting" || pathname === "/result/fail"

  return (
    <div className="min-h-screen bg-background">
      {!shouldHideHeader ? <Header transparent={isLandingPage} /> : null}
      {children}
    </div>
  )
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserLayoutContent>{children}</UserLayoutContent>
}
