"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDateKorean, formatTimeKorean, type Reservation } from "@/types"
import { ChevronRight, ChevronDown } from "lucide-react"

// Sample data - replace with actual data fetching
const sampleReservation: Reservation | null = {
  id: "1",
  date: "2026-05-25",
  time: "19:00",
  guests: 2,
  status: "confirmed",
  userName: "홍길동",
  phone: "010-1234-5678",
}

// Set to null to show empty state
// const sampleReservation: Reservation | null = null

type ModalType = "modify" | "cancel" | "cancelSuccess" | "modifySuccess" | null

// Calendar Component
function Calendar({
  selectedDate,
  onSelectDate,
  currentMonth,
  onNextMonth,
}: {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  currentMonth: Date
  onNextMonth: () => void
}) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Only Wednesdays (3) and Thursdays (4) are available
  const isAvailable = (date: Date) => {
    const dayOfWeek = date.getDay()
    return (dayOfWeek === 3 || dayOfWeek === 4) && date >= today
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="w-full rounded-lg border border-border p-4">
      <div className="mb-4 flex items-center justify-center">
        <span className="text-lg font-medium">
          {monthNames[month]} {year}
        </span>
        <button onClick={onNextMonth} className="ml-auto p-1">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted-foreground">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="py-2" />
          }

          const available = isAvailable(date)
          const isSelected =
            selectedDate &&
            date.toDateString() === selectedDate.toDateString()

          return (
            <button
              key={index}
              onClick={() => available && onSelectDate(date)}
              disabled={!available}
              className={`rounded-full py-2 text-sm ${
                isSelected
                  ? "border-2 border-destructive text-destructive"
                  : available
                    ? "text-destructive hover:bg-muted"
                    : "text-muted-foreground/40 line-through"
              }`}
            >
              {date.getDate()}
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
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative flex-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border-b border-border px-2 py-2 text-left"
      >
        <div>
          <span className="block text-xs text-muted-foreground">{label}</span>
          <span className="text-sm">{value}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-10 max-h-48 overflow-y-auto rounded-b-lg border border-t-0 border-border bg-background shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Modal Component
function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
      <div
        className="mx-4 w-full max-w-lg rounded-lg bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default function MyReservationsPage() {
  const [reservation, setReservation] = useState<Reservation | null>(
    sampleReservation
  )
  const [modalType, setModalType] = useState<ModalType>(null)

  // Modify form state
  const [selectedGuests, setSelectedGuests] = useState("2")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 1)
  })

  const guestOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} Guests`,
  }))

  const timeOptions = [
    { value: "", label: "All Day" },
    { value: "12:00", label: "오후 12시" },
    { value: "13:00", label: "오후 1시" },
    { value: "14:00", label: "오후 2시" },
    { value: "17:00", label: "오후 5시" },
    { value: "18:00", label: "오후 6시" },
    { value: "19:00", label: "오후 7시" },
    { value: "20:00", label: "오후 8시" },
  ]

  const handleModify = () => {
    // Reset form with current reservation values
    if (reservation) {
      setSelectedGuests(String(reservation.guests))
      setSelectedDate(new Date(reservation.date))
      setSelectedTime(reservation.time)
    }
    setModalType("modify")
  }

  const handleConfirmModify = () => {
    // Here you would call API to modify reservation
    if (reservation && selectedDate) {
      setReservation({
        ...reservation,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime || reservation.time,
        guests: parseInt(selectedGuests),
      })
    }
    setModalType("modifySuccess")
  }

  const handleCancel = () => {
    setModalType("cancel")
  }

  const handleConfirmCancel = () => {
    // Here you would call API to cancel reservation
    setReservation(null)
    setModalType("cancelSuccess")
  }

  const closeModal = () => {
    setModalType(null)
  }

  // Empty state
  if (!reservation) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">현재 예약 사항이 없습니다.</p>
      </div>
    )
  }

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
              onClick={handleModify}
              variant="secondary"
              className="w-28 bg-muted text-muted-foreground hover:bg-muted/80"
            >
              예약 변경
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-28 border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              예약 취소
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modify Modal */}
      <Modal isOpen={modalType === "modify"} onClose={closeModal}>
        <div className="flex gap-2 border-b border-border pb-4">
          <Dropdown
            label="Guests"
            value={`${selectedGuests} Guests`}
            options={guestOptions}
            onChange={setSelectedGuests}
          />
          <Dropdown
            label="Date"
            value={selectedDate ? "Selected" : "Today"}
            options={[{ value: "today", label: "Today" }]}
            onChange={() => {}}
          />
          <Dropdown
            label="Time"
            value={selectedTime ? formatTimeKorean(selectedTime) : "All Day"}
            options={timeOptions}
            onChange={setSelectedTime}
          />
        </div>

        <div className="py-4">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            currentMonth={currentMonth}
            onNextMonth={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={closeModal}
            variant="outline"
            className="flex-1 py-6"
          >
            닫기
          </Button>
          <Button
            onClick={handleConfirmModify}
            variant="secondary"
            className="flex-1 bg-muted py-6 text-muted-foreground hover:bg-muted/80"
            disabled={!selectedDate}
          >
            예약 변경하기
          </Button>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={modalType === "cancel"} onClose={closeModal}>
        <h2 className="mb-8 text-center text-xl font-semibold">
          정말 예약을 취소하시겠습니까?
        </h2>

        <div className="flex gap-4">
          <Button
            onClick={closeModal}
            variant="outline"
            className="flex-1 py-6"
          >
            닫기
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="secondary"
            className="flex-1 bg-muted py-6 text-muted-foreground hover:bg-muted/80"
          >
            예약 취소하기
          </Button>
        </div>
      </Modal>

      {/* Cancel Success Modal */}
      <Modal isOpen={modalType === "cancelSuccess"} onClose={closeModal}>
        <h2 className="mb-8 text-center text-xl font-semibold">
          예약이 취소 되었습니다.
        </h2>

        <Button
          onClick={closeModal}
          variant="secondary"
          className="w-full bg-muted py-6 text-muted-foreground hover:bg-muted/80"
        >
          확인
        </Button>
      </Modal>

      {/* Modify Success Modal */}
      <Modal isOpen={modalType === "modifySuccess"} onClose={closeModal}>
        <h2 className="mb-8 text-center text-xl font-semibold">
          예약이 변경 되었습니다.
        </h2>

        <Button
          onClick={closeModal}
          variant="secondary"
          className="w-full bg-muted py-6 text-muted-foreground hover:bg-muted/80"
        >
          확인
        </Button>
      </Modal>
    </div>
  )
}
