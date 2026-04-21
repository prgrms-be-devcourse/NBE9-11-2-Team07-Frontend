import { apiRequest } from "./api"

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELED"

export interface Reservation {
  reservationId: string
  date: string
  time: string
  guestCount: number
  status: ReservationStatus
  createdAt: string
}

// 예약 생성
export async function createReservation(
  date: string,
  time: string,
  guestCount: number
) {
  return apiRequest<{
    result_code: number
    data: {
      attemptId: string
      status: ReservationStatus
      queueNumber: number
      estimatedWaitMinutes: number
    }
  }>("/api/v1/reservations/attempts", {
    method: "POST",
    body: JSON.stringify({ date, time, guestCount }),
  })
}

// 예약 상태 조회 (폴링용)
export async function getReservationStatus(reservationId: string) {
  return apiRequest<{
    result_code: number
    data: {
      reservationId: string
      status: ReservationStatus
      queueNumber: number
      estimatedWaitMinutes: number
    }
  }>(`/api/v1/reservations/attempts/${reservationId}`)
}

// 대기열 복구 (브라우저 재접속 시)
export async function getMyWaitingReservation() {
  return apiRequest<{
    result_code: number
    data: {
      reservationId: string
      status: ReservationStatus
      queueNumber: number
      estimatedWaitMinutes: number
    } | null
  }>("/api/v1/waiting-room/me")
}

// 내 예약 목록
export async function getMyReservations() {
  return apiRequest<{
    result_code: number
    data: Reservation[]
  }>("/api/v1/my/reservations/")
}

// 예약 변경
export async function updateReservation(
  reservationId: string,
  date: string,
  time: string,
  guestCount: number
) {
  return apiRequest<{
    result_code: number
    data: Reservation
  }>(`/api/v1/my/reservations/${reservationId}`, {
    method: "PATCH",
    body: JSON.stringify({ date, time, guestCount }),
  })
}

// 예약 취소
export async function cancelReservation(reservationId: string, cancelReason: string) {
  return apiRequest<{
    result_code: number
    data: {
      reservationId: string
      status: ReservationStatus
      canceledAt: string
    }
  }>(`/api/v1/my/reservations/${reservationId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ cancelReason }),
  })
}