export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin pages have no Header - separate admin layout */}
      {children}
    </div>
  )
}
