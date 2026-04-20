import { Sidebar } from "@/components/layout/Sidebar"

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <Sidebar
        items={[
          { label: "나의 프로필", href: "/mypage/profile" },
          { label: "나의 예약", href: "/mypage" },
          { label: "고객 센터", href: "/mypage/support" },
        ]}
      />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
