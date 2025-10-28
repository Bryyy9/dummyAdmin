"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Map,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  BookMarked,
  ImageIcon,
  Code2,
  Search,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cultural-items", label: "Cultural Items", icon: BookOpen },
  { href: "/admin/regions", label: "Regions", icon: Map },
  { href: "/admin/contributors", label: "Contributors", icon: Users },
  { href: "/admin/references", label: "Referensi", icon: BookMarked },
  { href: "/admin/assets", label: "Asset", icon: ImageIcon },
  { href: "/admin/codification", label: "Codification", icon: Code2 },
  { href: "/admin/search-config", label: "Search Config", icon: Search },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("adminToken")

    // Clear cookie
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

    // Redirect to login
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-muted rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-card border-r border-border flex flex-col transition-all duration-300",
          "fixed md:relative h-screen z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Budaya Jawa Timur</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
