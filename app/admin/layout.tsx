"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/admin/sidebar"
import { TopBar } from "@/components/admin/top-bar"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const authCheckInProgress = useRef(false)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }

    if (authCheckInProgress.current) {
      return
    }

    const checkAuth = async () => {
      authCheckInProgress.current = true
      try {
        const token = localStorage.getItem("adminToken")

        if (!token) {
          console.log("No token found, redirecting to login")
          router.push("/admin/login")
          return
        }

        // Verify token with API
        const response = await fetch("/api/admin/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          console.log("Token verified successfully")
          setIsAuthenticated(true)
        } else {
          console.log("Token verification failed, status:", response.status)
          localStorage.removeItem("adminToken")
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("adminToken")
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
        authCheckInProgress.current = false
      }
    }

    checkAuth()
  }, [pathname])

  // Show login page without layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show layout only if authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
