"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarItem {
  label: string
  href: string
}

interface SidebarProps {
  items?: SidebarItem[]
}

const defaultItems: SidebarItem[] = [
  { label: "나의 프로필", href: "/mypage" },
  { label: "나의 예약", href: "/mypage/reservations" },
  { label: "고객 센터", href: "/mypage/support" },
]

export function Sidebar({ items = defaultItems }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-48 border-r border-border py-8 pr-8">
      <nav className="flex flex-col gap-4">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                isActive
                  ? "font-semibold text-foreground underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
