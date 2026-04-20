import { apiRequest } from "./api"
import { ReservationStatus } from "./reservations"

export interface AdminReservation {
  reservationId: string
  userName: string
  userEmail: string
  date: string
  time: string
  guestCount: number
  status: ReservationStatus
  createdAt: string
}

export async function getAdminReservations(params?: {
  date?: string
  time?: string
  status?: string
  page?: number
  size?: number
}) {
  const query = new URLSearchParams()
  if (params?.date) query.set("date", params.date)
  if (params?.time) query.set("time", params.time)
  if (params?.status) query.set("status", params.status)
  if (params?.page !== undefined) query.set("page", String(params.page))
  if (params?.size !== undefined) query.set("size", String(params.size))

  return apiRequest<{
    result_code: number
    data: {
      content: AdminReservation[]
      totalElements: number
      totalPages: number
    }
  }>(`/api/v1/admin/reservations?${query.toString()}`)
}

export async function forceCancel(reservationId: string, reason?: string) {
  return apiRequest<{
    result_code: number
    data: {
      reservationId: string
      status: ReservationStatus
      reason: string
      canceledAt: string
    }
  }>(`/api/v1/admin/reservations/${reservationId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason: reason ?? "" }),
  })
}

export async function getAdminSettings() {
  return apiRequest<{
    result_code: number
    data: {
      totalTables: number
      openingTime: string
      closingTime: string
    }
  }>("/api/v1/admin/settings")
}

export async function updateAdminSettings(
  totalTables: number,
  openingTime: string,
  closingTime: string
) {
  return apiRequest<{
    result_code: number
    data: {
      totalTables: number
      openingTime: string
      closingTime: string
    }
  }>("/api/v1/admin/settings", {
    method: "PATCH",
    body: JSON.stringify({ totalTables, openingTime, closingTime }),
  })
}

export async function getHolidays(month?: string) {
  const query = month ? `?month=${month}` : ""
  return apiRequest<{
    result_code: number
    data: {
      totalCount: number
      holidays: { date: string; reason: string }[]
    }
  }>(`/api/v1/admin/holidays${query}`)
}

export async function addHoliday(date: string, reason?: string) {
  return apiRequest<{
    result_code: number
    data: {
      date: string
      reason: string
      conflictingReservationCount: number
    }
  }>("/api/v1/admin/holidays", {
    method: "POST",
    body: JSON.stringify({ date, reason: reason ?? "" }),
  })
}

export async function deleteHoliday(date: string) {
  return apiRequest<{
    result_code: number
    data: null
  }>(`/api/v1/admin/holidays/${date}`, {
    method: "DELETE",
  })
}