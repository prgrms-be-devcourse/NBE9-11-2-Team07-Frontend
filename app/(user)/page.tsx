"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { getMyWaitingReservation } from "@/lib/reservations"

export default function LandingPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const ctaHref = isLoggedIn ? "/reservation" : "/login"

  useEffect(() => {
    if (!isLoggedIn) return

    // 로그인 상태면 진행 중인 예약 확인
    const checkWaiting = async () => {
      try {
        const res = await getMyWaitingReservation()
        if (res.data) {
          if (res.data.status === "CONFIRMED") {
            router.replace("/mypage/reservations")
          } else if (res.data.status === "CANCELED") {
            router.replace("/result/fail")
          } else {
            // PENDING이면 대기 화면으로
            router.replace("/waiting")
          }
        }
      } catch {
        // 진행 중인 예약 없음 → 그대로 메인
      }
    }

    checkWaiting()
  }, [isLoggedIn, router])

  return (
    <main className="relative h-screen w-full">
      <Image
        src="/restaurant-week-capa.jpg"
        alt="Gourmet steak dish"
        fill
        className="object-cover object-top"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
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