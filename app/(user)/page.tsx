"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function LandingPage() {
  const { isLoggedIn } = useAuth()
  const ctaHref = isLoggedIn ? "/reservation" : "/login"

  return (
    <main className="relative h-screen w-full">
      <Image
        src="/restaurant-week-capa.jpg"
        alt="Gourmet steak dish"
        fill
        className="object-cover object-top"
        priority
      />
      
      {/* 오버레이 더 어둡게 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 중앙에 식당 이름 + 예약하기 버튼 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold tracking-widest">모주</h1>
          <p className="mt-3 text-sm tracking-widest text-white/70">FINE DINING RESTAURANT</p>
        </div>
        <Button
          asChild
          size="lg"
          className="h-12 bg-white/90 px-16 text-base font-medium text-foreground shadow-lg hover:bg-white"
        >
          <Link href={ctaHref}>예약하기</Link>
        </Button>
      </div>
    </main>
  )
}