"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateSubculturePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    namaSubculture: "",
    penjelasan: "",
    cultureId: "",
    status: "PUBLISHED",
    statusKonservasi: "MAINTAINED",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subcultures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create subculture")

      router.push("/admin/subculture")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Subculture</h1>
        <p className="text-muted-foreground mt-2">Add a new cultural subculture</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subculture Details</CardTitle>
          <CardDescription>Fill in the information for the new subculture</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

            <div className="space-y-2">
              <label className="text-sm font-medium">Subculture Name</label>
              <Input
                name="namaSubculture"
                value={formData.namaSubculture}
                onChange={handleChange}
                placeholder="Enter subculture name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="penjelasan"
                value={formData.penjelasan}
                onChange={handleChange}
                placeholder="Enter description"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Culture ID</label>
              <Input
                name="cultureId"
                type="number"
                value={formData.cultureId}
                onChange={handleChange}
                placeholder="Enter culture ID"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Conservation Status</label>
                <Select
                  value={formData.statusKonservasi}
                  onValueChange={(value) => handleSelectChange("statusKonservasi", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAINTAINED">Maintained</SelectItem>
                    <SelectItem value="TREATENED">Threatened</SelectItem>
                    <SelectItem value="ENDANGERED">Endangered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Subculture"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
