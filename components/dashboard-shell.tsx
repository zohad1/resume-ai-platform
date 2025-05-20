import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <div className="grid gap-2 p-4 text-sm">
          <div className="py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Menu</h2>
            <DashboardNav section="menu" />
          </div>
          <div className="py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Account</h2>
            <DashboardNav section="account" />
          </div>
        </div>
      </aside>
      <main className="flex w-full flex-col overflow-hidden p-4 md:p-6">{children}</main>
    </div>
  )
}
