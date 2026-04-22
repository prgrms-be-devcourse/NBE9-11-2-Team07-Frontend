"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { AdminShell } from "@/components/layout/AdminShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getHolidays, addHoliday } from "@/lib/admin"

const weekdayLabel = ["일", "월", "화", "수", "목", "금", "토"]
const toDateKey = (date: Date) => format(date, "yyyy-MM-dd")

export default function AdminHolidaysPage() {
  const [holidaySet, setHolidaySet] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    getHolidays()
      .then((res) => {
        const set = new Set(res.data.holidays.map((h) => h.date))
        setHolidaySet(set)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const holidayDates = useMemo(
    () => Array.from(holidaySet).sort().map((key) => new Date(`${key}T00:00:00`)),
    [holidaySet]
  )

 const handleDateSelect = async (date?: Date) => {
    if (!date || date < today) return
    const key = toDateKey(date)

    if (!holidaySet.has(key)) {
      try {
        const res = await addHoliday(key)
        
        // 예약 존재 시 경고 팝업
        if (res.data.conflictingReservationCount > 0) {
          const confirm = window.confirm(
            `해당 날짜에 예약이 ${res.data.conflictingReservationCount}건 존재합니다. 휴무일로 설정하시겠습니까?`
          )
          if (!confirm) return
        }
        
        setHolidaySet((prev) => {
          const next = new Set(prev)
          next.add(key)
          return next
        })
      } catch (err: any) {
        if (err?.error_code === "HOLIDAY_ALREADY_EXISTS") {
          // 이미 존재 - 무시
        }
      }
    }
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">휴무일 설정</h1>
          <p className="mt-1 text-sm text-muted-foreground">달력에서 휴무일을 선택하고 관리할 수 있습니다.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">휴무일 선택</CardTitle>
              <CardDescription>달력에서 날짜를 클릭하여 휴무일을 추가하세요.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                onSelect={handleDateSelect}
                disabled={{ before: today }}
                modifiers={{ holiday: holidayDates }}
                modifiersClassNames={{ holiday: "bg-blue-600 text-white rounded-md hover:bg-blue-700" }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">휴무일 목록</CardTitle>
                  <CardDescription className="mt-1">총 {holidayDates.length}일 설정되어 있습니다.</CardDescription>
                </div>
                {holidayDates.length > 0 && (
                  <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {holidayDates.length}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="py-8 text-center text-muted-foreground">불러오는 중...</p>
              ) : holidayDates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-2xl">📅</p>
                  <p className="mt-2 text-sm text-muted-foreground">설정된 휴무일이 없습니다</p>
                  <p className="text-xs text-muted-foreground">왼쪽 달력에서 날짜를 선택해주세요</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {holidayDates.map((date) => (
                    <div key={toDateKey(date)} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 flex-col items-center justify-center rounded-md bg-blue-50 text-blue-600">
                          <span className="text-xs font-medium">{format(date, "MM")}월</span>
                          <span className="text-sm font-bold leading-none">{format(date, "dd")}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{format(date, "yyyy년 MM월 dd일")}</p>
                          <Badge variant="secondary" className="mt-0.5 text-xs">{weekdayLabel[date.getDay()]}요일</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">안내</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• 휴무일로 설정된 날짜에는 예약이 불가능합니다.</li>
            <li>• 달력에서 날짜를 클릭하면 휴무일이 추가됩니다.</li>
            <li>• 과거 날짜는 휴무일로 설정할 수 없습니다.</li>
          </ul>
        </div>
      </div>
    </AdminShell>
  )
}