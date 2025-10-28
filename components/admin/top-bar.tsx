"use client"

import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/admin/global-search"

export function TopBar() {
  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 gap-4">
      <GlobalSearch />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
