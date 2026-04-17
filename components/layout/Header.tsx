"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface HeaderProps {
  isLoggedIn?: boolean
  transparent?: boolean
}

export function Header({ isLoggedIn = false, transparent = false }: HeaderProps) {
  const navItems = [
    { label: "홈", href: "/", disabled: false },
    { label: "메뉴", href: "#", disabled: true },
    { label: "ABOUT", href: "#", disabled: true },
    { label: "예약하기", href: "/reservation", disabled: false },
  ]

  return (
    <header
      className={cn(
        "text-header-foreground",
        transparent ? "absolute left-0 right-0 top-0 z-50 bg-transparent" : "bg-header"
      )}
    >
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-lg font-medium tracking-wide">
          식당 이름 & 로고
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item, index) => (
            <div key={item.label} className="flex items-center">
              {index > 0 && (
                <span className="mx-4 text-header-foreground/60">|</span>
              )}
              {item.disabled ? (
                <span className="cursor-not-allowed text-sm text-header-foreground/60">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm transition-colors hover:text-header-foreground/80"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <span className="mx-4 text-header-foreground/60">|</span>
          {isLoggedIn ? (
            <Link
              href="/mypage"
              className="text-sm transition-colors hover:text-header-foreground/80"
            >
              내 정보
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm transition-colors hover:text-header-foreground/80"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
