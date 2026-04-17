import { Header } from "@/components/layout/Header"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Replace with actual auth state
  const isLoggedIn = false

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} />
      {children}
    </div>
  )
}
