import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDateKorean, formatTimeKorean, type Reservation } from "@/types"

// Sample data - replace with actual data fetching
const sampleReservation: Reservation = {
  id: "1",
  date: "2026-05-25",
  time: "19:00",
  guests: 2,
  status: "confirmed",
  userName: "홍길동",
  phone: "010-1234-5678",
}

export default function MyReservationsPage() {
  const reservation = sampleReservation

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">나의 예약</h1>

      <Card className="max-w-2xl">
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1.5">
            <p className="text-sm">
              예약일 : {formatDateKorean(reservation.date)}
            </p>
            <p className="text-sm">
              예약 시간 : {formatTimeKorean(reservation.time)}
            </p>
            <p className="text-sm">게스트 : {reservation.guests}명</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              className="w-28 bg-muted text-muted-foreground hover:bg-muted/80"
            >
              예약 변경
            </Button>
            <Button
              variant="outline"
              className="w-28 border-destructive text-destructive hover:bg-destructive/10"
            >
              예약 취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
