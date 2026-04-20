"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

interface HeaderProps {
  transparent?: boolean
}

export function Header({ transparent = false }: HeaderProps) {
  const router = useRouter()
  const { isLoggedIn, userRole, logout } = useAuth()

  const navItems = [
    { label: "홈", href: "/", disabled: false },
    { label: "메뉴", href: "#", disabled: true },
    { label: "ABOUT", href: "#", disabled: true },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleReservation = () => {
    if (isLoggedIn) {
      router.push("/reservation")
    } else {
      router.push("/login?callbackUrl=/reservation")
    }
  }

  // 관리자면 관리자 헤더 보여주기
  if (userRole === "admin") {
    return (
      <header className="bg-[#1a1a1a] text-white">
        <div className="flex h-14 items-center justify-between px-6">
          <Link href="/" className="text-lg font-medium tracking-wide text-white">
            모주
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/admin/dashboard" className="text-sm text-white transition-colors hover:text-white/80">예약현황</Link>
            <span className="mx-4 text-white/50">|</span>
            <Link href="/admin/inventory" className="text-sm text-white transition-colors hover:text-white/80">재고관리</Link>
            <span className="mx-4 text-white/50">|</span>
            <Link href="/admin/holidays" className="text-sm text-white transition-colors hover:text-white/80">휴무일설정</Link>
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
    )
  }

  return (
    <header
      className={cn(
        "text-white",
        transparent
          ? "absolute left-0 right-0 top-0 z-50 bg-black/40 backdrop-blur-sm"
          : "bg-[#1a1a1a]"
      )}
    >
      <div className="flex h-14 items-center justify-between px-6">
        <Link href="/" className="text-lg font-medium tracking-wide text-white">
          모주
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item, index) => (
            <div key={item.label} className="flex items-center">
              {index > 0 && (
                <span className="mx-4 text-white/50">|</span>
              )}
              {item.disabled ? (
                <span className="cursor-not-allowed text-sm text-white/50">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-white transition-colors hover:text-white/80"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <span className="mx-4 text-white/50">|</span>
          <button
            type="button"
            onClick={handleReservation}
            className="text-sm text-white transition-colors hover:text-white/80"
          >
            예약하기
          </button>
          <span className="mx-4 text-white/50">|</span>
          {isLoggedIn ? (
            <>
              <Link
                href="/mypage"
                className="text-sm text-white transition-colors hover:text-white/80"
              >
                내 정보
              </Link>
              <span className="mx-4 text-white/50">|</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-white transition-colors hover:text-white/80"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-white transition-colors hover:text-white/80"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}