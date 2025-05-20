"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Upload, BarChart, Settings, User, LogOut } from "lucide-react"

interface DashboardNavProps {
  section?: "menu" | "account" | "all"
}

export function DashboardNav({ section = "all" }: DashboardNavProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <FileText className="mr-2 h-4 w-4" />,
      exact: true,
    },
    {
      title: "Upload Resume",
      href: "/dashboard/upload",
      icon: <Upload className="mr-2 h-4 w-4" />,
      exact: false,
    },
    {
      title: "AI Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart className="mr-2 h-4 w-4" />,
      exact: false,
    },
  ]

  const accountItems = [
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <User className="mr-2 h-4 w-4" />,
      exact: false,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      exact: false,
    },
    {
      title: "Logout",
      href: "/login",
      icon: <LogOut className="mr-2 h-4 w-4" />,
      exact: false,
    },
  ]

  // Determine which items to display based on the section prop
  const navItems =
    section === "menu" ? menuItems : section === "account" ? accountItems : [...menuItems, ...accountItems]

  return (
    <nav className="grid gap-2 py-2">
      {navItems.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

        return (
          <Button
            key={item.href}
            variant={isActive ? "default" : "ghost"}
            className={cn("justify-start", isActive && "bg-emerald-600 hover:bg-emerald-700")}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
