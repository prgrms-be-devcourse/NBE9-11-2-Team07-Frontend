export type Reservation = {
  id: string
  date: string // "2026-05-25"
  time: string // "19:00"
  guests: number
  status: "confirmed" | "cancelled" | "pending"
  userName: string
  phone: string
}

export type User = {
  id: string
  name: string
  email: string
  isLoggedIn: boolean
}

// Helper function to format date in Korean
export function formatDateKorean(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}년 ${month}월 ${day}일`
}

// Helper function to format time in Korean 12h format
export function formatTimeKorean(timeString: string): string {
  const [hours, minutes] = timeString.split(":").map(Number)
  const period = hours >= 12 ? "오후" : "오전"
  const hour12 = hours % 12 || 12
  if (minutes === 0) {
    return `${period} ${hour12}시`
  }
  return `${period} ${hour12}시 ${minutes}분`
}
