"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

// Time slots
const LUNCH_TIMES = ["12:00", "12:30", "13:00", "13:30", "14:00"]
const DINNER_TIMES = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"]

// Format time to 12h format
function formatTime12h(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number)
  const period = hours >= 12 ? "오후" : "오전"
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${period} ${displayHours}:${minutes.toString().padStart(2, "0")}`
}

// Get available dates (only next month)
function getAvailableDates(): Set<string> {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate()
  
  const availableDates = new Set<string>()
  
  // Only Wednesdays (3) and Thursdays (4) are available
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day)
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 3 || dayOfWeek === 4) {
      availableDates.add(`${nextMonth.getFullYear()}-${(nextMonth.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`)
    }
  }
  
  return availableDates
}

// Calendar Component
function Calendar({
  selectedDate,
  onSelectDate,
  availableDates,
}: {
  selectedDate: string | null
  onSelectDate: (date: string) => void
  availableDates: Set<string>
}) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth() + 1, 1)
  )

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const days = useMemo(() => {
    const result: (number | null)[] = []
    
    // Empty cells for days before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      result.push(null)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      result.push(day)
    }
    
    return result
  }, [firstDayOfMonth, daysInMonth])

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isDateAvailable = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    return availableDates.has(dateStr)
  }

  const formatDateStr = (day: number) => {
    return `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      {/* Month Header */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg font-medium">{monthName}</span>
        <button onClick={goToNextMonth} className="p-1 hover:bg-accent rounded">
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-sm text-muted-foreground">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="p-2">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="p-2" />
          }

          const dateStr = formatDateStr(day)
          const isAvailable = isDateAvailable(day)
          const isSelected = selectedDate === dateStr

          return (
            <button
              key={day}
              onClick={() => isAvailable && onSelectDate(dateStr)}
              disabled={!isAvailable}
              className={`
                rounded-full p-2 text-sm transition-colors
                ${isAvailable 
                  ? isSelected 
                    ? "bg-red-500 text-white" 
                    : "text-foreground hover:bg-accent"
                  : "text-muted-foreground/40 line-through cursor-not-allowed"
                }
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Dropdown Component
function Dropdown({
  label,
  value,
  options,
  onSelect,
  placeholder,
}: {
  label: string
  value: string | null
  options: { value: string; label: string }[]
  onSelect: (value: string) => void
  placeholder: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative">
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded border border-border bg-background px-3 py-2 text-left text-sm"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded border border-border bg-background shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value)
                setIsOpen(false)
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ReservationPage() {
  const router = useRouter()
  const [guests, setGuests] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const availableDates = useMemo(() => getAvailableDates(), [])

  const { isLoggedIn } = useAuth()

  const guestOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} Guests`,
  }))

  const timeOptions = [...LUNCH_TIMES, ...DINNER_TIMES].map((time) => ({
    value: time,
    label: formatTime12h(time),
  }))

  const isFormValid = Boolean(guests && selectedDate && selectedTime)
  
  // Get display date
  const displayDate = selectedDate 
    ? new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Today"

  const handleSubmit = () => {
    if (!isFormValid) return

    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/reservation")
      return
    }

    // TODO: POST /api/reservations 연동 예정
    router.push("/waiting")
  }

  // Calculate next month's opening date message
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
  const currentMonthName = monthNames[today.getMonth()]
  const nextMonthName = monthNames[nextMonth.getMonth()]

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background px-4 py-8">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Filter Dropdowns */}
        <div className="grid grid-cols-3 gap-4">
          <Dropdown
            label="Guests"
            value={guests}
            options={guestOptions}
            onSelect={setGuests}
            placeholder="2 Guests"
          />
          <Dropdown
            label="Date"
            value={selectedDate}
            options={[
              { value: "today", label: "Today" },
              ...(selectedDate ? [{ value: selectedDate, label: displayDate }] : [])
            ]}
            onSelect={() => {}}
            placeholder={displayDate}
          />
          <Dropdown
            label="Time"
            value={selectedTime}
            options={timeOptions}
            onSelect={setSelectedTime}
            placeholder="시간 선택"
          />
        </div>

        {/* Calendar */}
        <Calendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          availableDates={availableDates}
        />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="h-12 w-full bg-[#d4c8be] text-foreground hover:bg-[#c5b9af] disabled:bg-muted disabled:text-muted-foreground"
        >
          예약하기
        </Button>

        {/* Info Notes */}
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            {currentMonthName}은 전석 매진되었습니다. {nextMonthName} 예약은 {currentMonthName} 1일 오전 11시에 오픈됩니다.
          </li>
          <li>
            모든 팀이 동시에 시작하므로 시간을 꼭 엄수해 주세요. 지각하실 경우 도착 시점에 진행 중인 코스부터 식사가 가능합니다.
          </li>
        </ul>
      </div>
    </main>
  )
}
