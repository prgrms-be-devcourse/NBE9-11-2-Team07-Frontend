"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"

interface AdminShellProps {
  children: React.ReactNode
}

const adminMenu = [
  { label: "예약현황", href: "/admin/dashboard" },
  { label: "재고관리", href: "/admin/inventory" },
  { label: "휴무일설정", href: "/admin/holidays" },
]

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, isAuthResolved, userRole, logout } = useAuth()
  useEffect(() => {
    if (!isAuthResolved) return

    if (!isLoggedIn || userRole !== "admin") {
      router.replace("/admin/login")
    }
  }, [isAuthResolved, isLoggedIn, router, userRole])

  const handleLogout = () => {
    logout()
    router.push("/")
  }
  if (!isAuthResolved) {
    return <div className="min-h-screen bg-background" />
  }

  if (!isLoggedIn || userRole !== "admin") {
    return null
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#1a1a1a] text-white">
        <div className="flex h-14 items-center justify-between px-6">
          {/* 왼쪽: 로고 */}
          <Link href="/" className="text-lg font-medium tracking-wide text-white">
            모주
          </Link>

          {/* 오른쪽: 메뉴 + 로그아웃 */}
          <nav className="flex items-center gap-1">
            {adminMenu.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <div key={item.href} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-4 text-white/50">|</span>
                  )}
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm text-white transition-colors hover:text-white/80",
                      isActive ? "underline underline-offset-4" : ""
                    )}
                  >
                    {item.label}
                  </Link>
                </div>
              )
            })}
            <span className="mx-4 text-white/50">|</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-white transition-colors hover:text-white/80"
            >
              로그아웃
            </button>
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-56px)] p-8">{children}</main>
    </div>
  )
}