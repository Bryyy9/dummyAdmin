"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAdminToken, verifyAdminToken } from "@/lib/admin-auth"

export function withAdminProtection<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const checkAuth = async () => {
        const token = await getAdminToken()

        if (!token) {
          router.push("/admin/login")
          return
        }

        const isValid = await verifyAdminToken(token)

        if (!isValid) {
          router.push("/admin/login")
          return
        }

        setIsAuthorized(true)
        setIsLoading(false)
      }

      checkAuth()
    }, [router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthorized) {
      return null
    }

    return <Component {...props} />
  }
}
