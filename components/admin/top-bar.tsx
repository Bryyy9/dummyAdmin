// components/admin/top-bar.tsx
"use client"

import { useState, useEffect } from "react"
import { Bell, User, Search, LogOut, Settings, UserCircle, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
}

interface UserProfile {
  name: string
  email: string
  role: string
  avatar?: string
}

export function TopBar() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Admin User",
    email: "admin@budaya.com",
    role: "Administrator"
  })
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Load notifications
    loadNotifications()
    
    // Load user profile from localStorage
    const token = localStorage.getItem("adminToken")
    if (token) {
      try {
        // PERBAIKAN: Decode token dengan cara yang benar
        let decoded: any
        
        // Cek apakah token adalah JWT (format: xxx.yyy.zzz)
        if (token.includes('.')) {
          // JWT token
          const parts = token.split('.')
          if (parts.length === 3) {
            // Decode payload (bagian kedua dari JWT)
            decoded = JSON.parse(atob(parts[1]))
          }
        } else {
          // Base64 encoded JSON (format yang digunakan di login API)
          decoded = JSON.parse(atob(token))
        }

        if (decoded) {
          setUserProfile(prev => ({
            ...prev,
            email: decoded.email || prev.email,
            name: decoded.name || prev.name,
            role: decoded.role || prev.role
          }))
        }
      } catch (error) {
        console.error("Error decoding token:", error)
        // Jika gagal decode, gunakan default values
        // Token mungkin invalid, tapi biarkan user tetap login
      }
    }
  }, [])

  const loadNotifications = () => {
    // Mock notifications - bisa diganti dengan API call
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "New Lexicon Entry",
        message: "5 new lexicon entries have been added",
        time: "5 minutes ago",
        read: false,
        type: "info"
      },
      {
        id: 2,
        title: "Contributor Registered",
        message: "Dr. Budi Santoso joined as a new contributor",
        time: "1 hour ago",
        read: false,
        type: "success"
      },
      {
        id: 3,
        title: "Conservation Alert",
        message: "2 items marked as endangered status",
        time: "2 hours ago",
        read: false,
        type: "warning"
      },
      {
        id: 4,
        title: "System Update",
        message: "Database backup completed successfully",
        time: "1 day ago",
        read: true,
        type: "success"
      },
      {
        id: 5,
        title: "Review Required",
        message: "3 draft entries pending review",
        time: "2 days ago",
        read: true,
        type: "info"
      }
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
    setUnreadCount(0)
    toast.success("All notifications marked as read")
  }

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    const notif = notifications.find(n => n.id === id)
    if (notif && !notif.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    toast.success("Notification removed")
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("adminToken")
    
    // Clear cookie
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    
    toast.success("Logged out successfully")
    
    // Redirect to login
    router.push("/admin/login")
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`)
      // Implement search logic here
      // router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "ℹ️"
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-l-4 border-l-green-500"
      case "warning":
        return "border-l-4 border-l-yellow-500"
      case "error":
        return "border-l-4 border-l-red-500"
      default:
        return "border-l-4 border-l-blue-500"
    }
  }

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 gap-4 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search lexicons, contributors, references..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notif.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                    } ${getNotificationColor(notif.type)}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                          <p className="font-medium text-sm truncate">{notif.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{notif.message}</p>
                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearNotification(notif.id)
                        }}
                        className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <span className="text-red-500">×</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    toast.info("View all notifications")
                    // router.push("/admin/notifications")
                  }}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
                <Badge variant="secondary" className="w-fit mt-1 text-xs">
                  {userProfile.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Opening support...")}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}