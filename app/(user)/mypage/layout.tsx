import { Sidebar } from "@/components/layout/Sidebar"

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
