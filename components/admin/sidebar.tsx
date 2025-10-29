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
  ChevronDown,
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
  {
    label: "Subculture",
    icon: BookMarked,
    submenu: [
      { href: "/admin/subculture", label: "Subculture List" },
      { href: "/admin/subculture/create", label: "Create Subculture" },
      { href: "/admin/subculture/assets", label: "Subculture Assets" },
    ],
  },
  {
    label: "Lexicon",
    icon: BookOpen,
    submenu: [
      { href: "/admin/lexicon", label: "Lexicon List" },
      { href: "/admin/lexicon/create", label: "Create Lexicon" },
      { href: "/admin/lexicon/assets", label: "Lexicon Assets" },
      { href: "/admin/lexicon/references", label: "Lexicon References" },
    ],
  },
  { href: "/admin/search-config", label: "Search Config", icon: Search },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("adminToken")

    // Clear cookie
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

    // Redirect to login
    router.push("/admin/login")
    router.refresh()
  }

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) => (prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]))
  }

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
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
            if ("submenu" in item) {
              const isExpanded = expandedMenus.includes(item.label)
              const hasActiveSubmenu = isSubmenuActive(item.submenu)
              const Icon = item.icon

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                      hasActiveSubmenu
                        ? "bg-black text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded ? "rotate-180" : "")} />
                  </button>

                  {/* Submenu items */}
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                      {item.submenu.map((subitem) => {
                        const isActive = pathname === subitem.href || pathname.startsWith(subitem.href + "/")

                        return (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-sm",
                              isActive
                                ? "bg-black text-white font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            <span>{subitem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            // Regular menu item
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                  isActive ? "bg-black text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
