"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { User, Lock, Bell, Globe } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@budaya.com",
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Profile updated successfully")
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.new !== password.confirm) {
      toast.error("New passwords don't match")
      return
    }
    toast.success("Password changed successfully")
    setPassword({ current: "", new: "", confirm: "" })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Profile Information</h2>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </Card>

      {/* Password Change */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current"
              type="password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="new">New Password</Label>
            <Input
              id="new"
              type="password"
              value={password.new}
              onChange={(e) => setPassword({ ...password, new: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
            />
          </div>
          <Button type="submit">Change Password</Button>
        </form>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive email updates</p>
            </div>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Items Alert</p>
              <p className="text-sm text-muted-foreground">Get notified when new items are added</p>
            </div>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Language & Region */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Language & Region</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <select id="language" className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <select id="timezone" className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
              <option value="Asia/Jakarta">WIB (GMT+7)</option>
              <option value="Asia/Makassar">WITA (GMT+8)</option>
              <option value="Asia/Jayapura">WIT (GMT+9)</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}
