"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { getReservationStatus, getMyWaitingReservation } from "@/lib/reservations"

export default function WaitingPage() {
  const router = useRouter()
  const [isTimedOut, setIsTimedOut] = useState(false)

  useEffect(() => {
    let reservationId = sessionStorage.getItem("reservationId")
    let pollingInterval: NodeJS.Timeout
    let timeoutTimer: NodeJS.Timeout

    const startPolling = (id: string) => {
      // 2분 타임아웃
      timeoutTimer = setTimeout(() => {
        clearInterval(pollingInterval)
        setIsTimedOut(true)
        setTimeout(() => router.replace("/"), 3000)
      }, 120000)

      // 2초마다 상태 폴링
      pollingInterval = setInterval(async () => {
        try {
          const res = await getReservationStatus(id)
          const { status } = res.data

          if (status === "CONFIRMED") {
            clearInterval(pollingInterval)
            clearTimeout(timeoutTimer)
            sessionStorage.removeItem("reservationId")
            router.replace("/mypage/reservations")
          } else if (status === "CANCELED") {
            clearInterval(pollingInterval)
            clearTimeout(timeoutTimer)
            sessionStorage.removeItem("reservationId")
            router.replace("/result/fail")
          }
        } catch {
          clearInterval(pollingInterval)
          clearTimeout(timeoutTimer)
          setIsTimedOut(true)
          setTimeout(() => router.replace("/"), 3000)
        }
      }, 2000)
    }

    const init = async () => {
      // reservationId 없으면 서버에서 복구 시도
      if (!reservationId) {
        try {
          const res = await getMyWaitingReservation()
          if (res.data) {
            reservationId = res.data.reservationId
            sessionStorage.setItem("reservationId", reservationId)

            // 이미 처리된 경우
            if (res.data.status === "CONFIRMED") {
              router.replace("/mypage/reservations")
              return
            }
            if (res.data.status === "CANCELED") {
              router.replace("/result/fail")
              return
            }
          } else {
            // 진행 중인 예약 없음 → 홈으로
            router.replace("/")
            return
          }
        } catch {
          router.replace("/")
          return
        }
      }

      startPolling(reservationId!)
    }

    init()

    return () => {
      clearInterval(pollingInterval)
      clearTimeout(timeoutTimer)
    }
  }, [router])

  if (isTimedOut) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <p className="text-center text-xl font-semibold text-foreground">
          잠시 후 다시 시도해 주세요
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 rounded-full border border-border p-5">
        <Spinner className="size-10" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">
        좌석 상태를 실시간으로 확인하고 있습니다
      </h1>
      <p className="mt-4 text-center text-muted-foreground">
        마지막 한 자리까지 꼼꼼히 확인 중이에요. 잠시만 기다려 주세요!
      </p>
    </div>
  )
}