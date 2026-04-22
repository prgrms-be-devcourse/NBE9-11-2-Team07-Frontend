"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getMyReservations, updateReservation, cancelReservation, type Reservation } from "@/lib/reservations"

type ModalType = "change" | "changeSuccess" | "cancel" | "cancelSuccess" | null

const timeOptions = ["12:00", "12:30", "13:00", "13:30", "14:00", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"]

function formatDateKorean(dateStr: string) {
  const [year, month, day] = dateStr.split("-")
  return `${year}년 ${month}월 ${day}일`
}

function formatTimeKorean(time: string) {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "오후" : "오전"
  const hour = h > 12 ? h - 12 : h
  return `${period} ${hour}시${m > 0 ? ` ${m}분` : ""}`
}

function getAvailableDates(): string[] {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate()
  const availableDates: string[] = []
  for (let day = 1; day <= lastDay; day++) {
    availableDates.push(
      `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    )
  }
  return availableDates
}

function getCancelReasonLabel(reason: string) {
  switch (reason) {
    case "ADMIN_CANCEL": return "관리자에 의해 취소됨"
    case "LATE_CANCEL": return "24시간 이내 취소 (본인)"
    case "LOCK_ACQUIRE_FAIL": return "시스템 오류로 취소"
    case "RESERVATION_FAILED": return "재고 부족으로 취소"
    default: return `본인 취소: ${reason}`
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "CONFIRMED": return "확정"
    case "PENDING": return "대기중"
    case "CANCELED": return "취소됨"
    case "CANCEL_PENDING": return "취소 대기중"
    default: return status
  }
}

export default function MyReservationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [errorMsg, setErrorMsg] = useState("")

  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")
  const [editGuests, setEditGuests] = useState("2")
  const [cancelReason, setCancelReason] = useState("")

  const guestOptions = useMemo(() => Array.from({ length: 8 }, (_, i) => String(i + 1)), [])
  const availableDates = useMemo(() => getAvailableDates(), [])

  useEffect(() => {
    getMyReservations()
      .then((res) => {
        setReservations(res.data)
      })
      .catch(() => setReservations([]))
      .finally(() => setIsLoading(false))
  }, [])

  const openChangeModal = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setEditDate(reservation.date)
    setEditTime(reservation.time.slice(0, 5))  // "13:30:00" → "13:30"
    setEditGuests(String(reservation.guestCount))
    setErrorMsg("")
    setModalType("change")
  }

  const openCancelModal = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setCancelReason("")
    setModalType("cancel")
  }

  const onConfirmChange = async () => {
    if (!selectedReservation) return

    // 기존 값과 동일하면 안내
    if (
      editDate === selectedReservation.date &&
      editTime === selectedReservation.time.slice(0, 5) &&
      Number(editGuests) === selectedReservation.guestCount
    ) {
      setErrorMsg("변경사항이 없습니다.")
      return
    }

    try {
      const res = await updateReservation(
        selectedReservation.reservationId,
        editDate,
        editTime,
        Number(editGuests)
      )
      setReservations((prev) =>
        prev.map((r) => r.reservationId === selectedReservation.reservationId ? res.data : r)
      )
      setModalType("changeSuccess")
    } catch (err: any) {
      if (err?.error_code === "SLOT_UNAVAILABLE") {
        setErrorMsg("선택하신 시간대가 마감되었습니다.")
      } else {
        setErrorMsg("예약 변경에 실패했습니다. 다시 시도해주세요.")
      }
    }
  }

  const onConfirmCancel = async () => {
    if (!selectedReservation) return
    try {
      await cancelReservation(selectedReservation.reservationId, cancelReason)
      setReservations((prev) =>
        prev.map((r) => r.reservationId === selectedReservation.reservationId ? { ...r, status: "CANCELED" } : r)
      )
      setModalType("cancelSuccess")
    } catch {
      setModalType(null)
    }
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">나의 예약</h1>

      {isLoading && (
        <div className="space-y-3 max-w-2xl">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-6">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-5 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && reservations.length === 0 && (
        <div className="flex min-h-[320px] items-center justify-center rounded-md border border-dashed border-border">
          <p className="text-muted-foreground">현재 예약 사항이 없습니다.</p>
        </div>
      )}

      {!isLoading && reservations.length > 0 && (
        <div className="space-y-3 max-w-2xl">
          {reservations.map((reservation) => (
            <Card key={reservation.reservationId}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1.5">
                  <p className="text-sm">예약일: {formatDateKorean(reservation.date)}</p>
                  <p className="text-sm">예약시간: {formatTimeKorean(reservation.time)}</p>
                  <p className="text-sm">게스트 인원: {reservation.guestCount}명</p>
                  <p className="text-sm">상태: {getStatusLabel(reservation.status)}</p>
                </div>
                {reservation.status === "CONFIRMED" && (
                  <div className="flex flex-col gap-3">
                    <Button onClick={() => openChangeModal(reservation)} variant="secondary" className="w-28 bg-muted text-muted-foreground hover:bg-muted/80">
                      예약 변경
                    </Button>
                    <Button onClick={() => openCancelModal(reservation)} className="w-28 bg-destructive hover:bg-destructive/90" style={{ color: "white" }}>
                      예약 취소
                    </Button>
                  </div>
                )}
                {reservation.status === "CANCELED" && reservation.cancelReason && (
                  <p className="text-sm text-muted-foreground">
                    취소 사유: {getCancelReasonLabel(reservation.cancelReason)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalType === "change"} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent showCloseButton={false} className="max-w-xl">
          <DialogHeader>
            <DialogTitle>예약 변경</DialogTitle>
            <DialogDescription>기존 예약값이 기본으로 설정되어 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>예약일</Label>
              <Select value={editDate} onValueChange={setEditDate}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableDates.map((date) => (
                    <SelectItem key={date} value={date}>{formatDateKorean(date)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>예약시간</Label>
              <Select value={editTime} onValueChange={setEditTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{formatTimeKorean(time)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>게스트</Label>
              <Select value={editGuests} onValueChange={setEditGuests}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {guestOptions.map((count) => (
                    <SelectItem key={count} value={count}>{count}명</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>닫기</Button>
            <Button onClick={onConfirmChange}>예약변경하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalType === "changeSuccess"} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center">예약이 변경 되었습니다.</DialogTitle>
          </DialogHeader>
          <Button onClick={() => setModalType(null)}>확인</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalType === "cancel"} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center">정말 예약을 취소하시겠습니까?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>취소 사유</Label>
            <input
              className="w-full rounded border border-border px-3 py-2 text-sm"
              placeholder="취소 사유를 입력해주세요"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>닫기</Button>
            <Button variant="destructive" onClick={onConfirmCancel} disabled={!cancelReason}>예약취소하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalType === "cancelSuccess"} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center">예약이 취소 되었습니다.</DialogTitle>
          </DialogHeader>
          <Button onClick={() => setModalType(null)}>확인</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}