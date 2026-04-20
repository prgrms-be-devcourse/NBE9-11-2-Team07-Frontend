"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ReservationFailPage() {
  const router = useRouter()

  useEffect(() => {
    const handlePopState = () => {
      router.replace("/reservation")
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [router])

  const handleRetry = () => {
    sessionStorage.removeItem("reservation_selection")
    router.replace("/reservation")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Red X Icon */}
      <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-destructive">
        <svg
          className="h-14 w-14 text-destructive-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-2xl font-bold text-foreground">예약 실패</h1>

      {/* Description */}
      <p className="mb-16 text-center text-muted-foreground">
        현재 선택하신 시간대는 예약이 마감되었습니다.
      </p>

      {/* Retry Button */}
      <Button
        onClick={handleRetry}
        variant="secondary"
        className="w-64 bg-muted py-6 text-base text-muted-foreground hover:bg-muted/80"
      >
        다른 시간대 보기
      </Button>
    </div>
  )
}
