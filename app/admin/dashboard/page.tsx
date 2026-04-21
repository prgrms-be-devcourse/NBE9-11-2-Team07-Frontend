"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { AdminShell } from "@/components/layout/AdminShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { getAdminReservations, forceCancel, type AdminReservation } from "@/lib/admin"

const timeFilterMap = { all: "전체시간", lunch: "런치", dinner: "디너" } as const

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<AdminReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [timeFilter, setTimeFilter] = useState<keyof typeof timeFilterMap>("all")
  const [cancelTarget, setCancelTarget] = useState<AdminReservation | null>(null)
  const [isCanceling, setIsCanceling] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const fetchReservations = async () => {
    try {
      setIsLoading(true)
      const params: Record<string, string> = {}
      if (selectedDate) params.date = format(selectedDate, "yyyy-MM-dd")
      if (timeFilter === "lunch") params.time = "12:00"
      if (timeFilter === "dinner") params.time = "17:00"
      const res = await getAdminReservations(params)
      setRows(res.data.content ?? [])
    } catch {
      setRows([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [selectedDate, timeFilter])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const hour = Number(row.time.split(":")[0])
      const byTime = timeFilter === "all" ? true : timeFilter === "lunch" ? hour < 17 : hour >= 17
      return byTime
    })
  }, [rows, timeFilter])

 const handleForceCancel = async () => {
  if (!cancelTarget) return
  try {
    setIsCanceling(true)
    await forceCancel(cancelTarget.reservationId, cancelReason)  // cancelReason 추가
    setRows((prev) =>
      prev.map((row) =>
        row.reservationId === cancelTarget.reservationId ? { ...row, status: "CANCELED" } : row
      )
    )
    setCancelTarget(null)
    setCancelReason("")  // 초기화 추가
  } catch {
    setCancelTarget(null)
  } finally {
    setIsCanceling(false)
  }
}

  const resetFilter = () => {
    setSelectedDate(undefined)
    setTimeFilter("all")
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">예약 현황</h1>
          <p className="text-sm text-muted-foreground">예약 내역을 조회하고 관리할 수 있습니다</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">필터</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-56 justify-start font-normal">
                  {selectedDate ? format(selectedDate, "PPP", { locale: ko }) : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
              </PopoverContent>
            </Popover>
            <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as keyof typeof timeFilterMap)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체시간</SelectItem>
                <SelectItem value="lunch">런치</SelectItem>
                <SelectItem value="dinner">디너</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilter}>필터 초기화</Button>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground">총 예약 건수: {filteredRows.length}건</div>

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : filteredRows.length === 0 ? (
              <p className="py-16 text-center text-muted-foreground">예약이 없습니다</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>예약자명</TableHead>
                    <TableHead>날짜</TableHead>
                    <TableHead>시간</TableHead>
                    <TableHead>인원</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>취소사유</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow key={row.reservationId}>
                      <TableCell>{row.userName}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>{row.guestCount}명</TableCell>
                      <TableCell>{row.userEmail}</TableCell>
                      <TableCell>
                        <Badge className={row.status === "CONFIRMED" ? "bg-blue-600 text-white" : "bg-destructive text-white"}>
                          {row.status === "CONFIRMED" ? "확정" : "취소"}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.cancelReason ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="destructive" onClick={() => setCancelTarget(row)} disabled={row.status === "CANCELED"}>
                          강제취소
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(cancelTarget)} onOpenChange={(open) => !open && setCancelTarget(null)}>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>예약 취소</DialogTitle>
      <DialogDescription>이 작업은 되돌릴 수 없습니다</DialogDescription>
    </DialogHeader>

    {/* 추가 */}
    <div className="space-y-2">
      <label className="text-sm font-medium">취소 사유</label>
      <input
        className="w-full rounded border border-border px-3 py-2 text-sm"
        placeholder="취소 사유를 입력하세요"
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
      />
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => { setCancelTarget(null); setCancelReason("") }} disabled={isCanceling}>취소</Button>
      <Button variant="destructive" onClick={handleForceCancel} disabled={isCanceling || !cancelReason}>
        {isCanceling ? "처리 중..." : "확인"}
      </Button>
    </DialogFooter>
  </DialogContent>
  </Dialog>
    </AdminShell>
  )
}