"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { getAdminSettings, updateAdminSettings } from "@/lib/admin"

export default function AdminInventoryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [tableCount, setTableCount] = useState("10")
  const [lunchCapacity, setLunchCapacity] = useState("16")
  const [dinnerCapacity, setDinnerCapacity] = useState("16")
  const [lunchEnabled, setLunchEnabled] = useState(true)
  const [dinnerEnabled, setDinnerEnabled] = useState(true)
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  // 설정 초기값 불러오기
  useEffect(() => {
    getAdminSettings()
      .then((res) => {
        setTableCount(String(res.data.totalTables))
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const isValid = Boolean(tableCount && lunchCapacity && dinnerCapacity)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError("")
      await updateAdminSettings(
        Number(tableCount),
        lunchEnabled ? "12:00" : "",
        dinnerEnabled ? "20:00" : ""
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("저장에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminShell>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">재고 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">테이블 수와 시간대별 예약 가능 인원을 설정합니다.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">테이블 설정</CardTitle>
              <CardDescription>식당의 테이블 수를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="table-count">테이블 수</Label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setTableCount(String(Math.max(1, Number(tableCount) - 1)))} className="flex size-9 items-center justify-center rounded-md border border-border text-lg hover:bg-accent">−</button>
                  <Input id="table-count" inputMode="numeric" value={tableCount} onChange={(e) => setTableCount(e.target.value.replace(/\D/g, ""))} className="w-20 text-center" />
                  <button onClick={() => setTableCount(String(Number(tableCount) + 1))} className="flex size-9 items-center justify-center rounded-md border border-border text-lg hover:bg-accent">+</button>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium">1팀 최대 예약 인원</p>
                <p className="mt-1 text-2xl font-bold">8명</p>
                <p className="mt-1 text-xs text-muted-foreground">시스템 고정값 (변경 불가)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">영업시간 설정</CardTitle>
              <CardDescription>런치/디너 운영 여부와 시간대별 최대 인원을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`rounded-lg border p-4 space-y-3 transition-opacity ${!lunchEnabled ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">🍱 런치</p>
                    <p className="text-xs text-muted-foreground">12:00 ~ 14:00 (30분 간격)</p>
                  </div>
                  <button onClick={() => setLunchEnabled(!lunchEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lunchEnabled ? "bg-blue-600" : "bg-muted-foreground/30"}`}>
                    <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${lunchEnabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
                {lunchEnabled && (
                  <div className="space-y-1">
                    <Label className="text-xs">시간대 최대 예약 인원</Label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setLunchCapacity(String(Math.max(1, Number(lunchCapacity) - 1)))} className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent">−</button>
                      <Input inputMode="numeric" value={lunchCapacity} onChange={(e) => setLunchCapacity(e.target.value.replace(/\D/g, ""))} className="w-20 text-center" />
                      <button onClick={() => setLunchCapacity(String(Number(lunchCapacity) + 1))} className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent">+</button>
                      <span className="text-sm text-muted-foreground">명</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={`rounded-lg border p-4 space-y-3 transition-opacity ${!dinnerEnabled ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">🍷 디너</p>
                    <p className="text-xs text-muted-foreground">17:00 ~ 20:00 (30분 간격)</p>
                  </div>
                  <button onClick={() => setDinnerEnabled(!dinnerEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dinnerEnabled ? "bg-blue-600" : "bg-muted-foreground/30"}`}>
                    <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${dinnerEnabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
                {dinnerEnabled && (
                  <div className="space-y-1">
                    <Label className="text-xs">시간대 최대 예약 인원</Label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setDinnerCapacity(String(Math.max(1, Number(dinnerCapacity) - 1)))} className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent">−</button>
                      <Input inputMode="numeric" value={dinnerCapacity} onChange={(e) => setDinnerCapacity(e.target.value.replace(/\D/g, ""))} className="w-20 text-center" />
                      <button onClick={() => setDinnerCapacity(String(Number(dinnerCapacity) + 1))} className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent">+</button>
                      <span className="text-sm text-muted-foreground">명</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" onClick={handleSave} disabled={!isValid || isSaving}>
            {isSaving ? "저장 중..." : "설정 저장"}
          </Button>
          {saved && <p className="text-sm text-blue-600">✓ 설정이 저장되었습니다.</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">현재 설정 요약</h2>
          <div className="flex flex-wrap gap-0 divide-x divide-border">
            <div className="flex flex-col gap-1 px-6 first:pl-0">
              <span className="text-xs text-muted-foreground">테이블 수</span>
              <span className="text-2xl font-bold">{tableCount || 0}<span className="text-base font-normal text-muted-foreground ml-1">개</span></span>
            </div>
            <div className="flex flex-col gap-1 px-6">
              <span className="text-xs text-muted-foreground">1팀 최대 인원</span>
              <span className="text-2xl font-bold">8<span className="text-base font-normal text-muted-foreground ml-1">명</span></span>
              <span className="text-xs text-muted-foreground">고정</span>
            </div>
            <div className="flex flex-col gap-1 px-6">
              <span className="text-xs text-muted-foreground">🍱 런치 최대 인원</span>
              {lunchEnabled ? <span className="text-2xl font-bold">{lunchCapacity || 0}<span className="text-base font-normal text-muted-foreground ml-1">명</span></span> : <span className="text-base font-medium text-muted-foreground">운영 안함</span>}
              <span className="text-xs text-muted-foreground">12:00 ~ 14:00</span>
            </div>
            <div className="flex flex-col gap-1 px-6">
              <span className="text-xs text-muted-foreground">🍷 디너 최대 인원</span>
              {dinnerEnabled ? <span className="text-2xl font-bold">{dinnerCapacity || 0}<span className="text-base font-normal text-muted-foreground ml-1">명</span></span> : <span className="text-base font-medium text-muted-foreground">운영 안함</span>}
              <span className="text-xs text-muted-foreground">17:00 ~ 20:00</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}