"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface FormData {
  namaSubculture: string
  penjelasan: string
  cultureId: number
  status: string
  statusKonservasi: string
}

export default function EditSubculturePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    namaSubculture: "",
    penjelasan: "",
    cultureId: 1,
    status: "DRAFT",
    statusKonservasi: "MAINTAINED",
  })

  useEffect(() => {
    const fetchSubculture = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcultures/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch subculture")
        const data = await response.json()
        setFormData({
          namaSubculture: data.namaSubculture,
          penjelasan: data.penjelasan,
          cultureId: data.cultureId,
          status: data.status,
          statusKonservasi: data.statusKonservasi,
        })
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load subculture")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSubculture()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcultures/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update subculture")

      toast.success("Subculture updated successfully")
      router.push(`/admin/subculture/${params.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update")
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/subculture/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Subculture</h1>
          <p className="text-muted-foreground mt-1">Update subculture information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subculture Details</CardTitle>
          <CardDescription>Edit the subculture information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="namaSubculture">Subculture Name *</Label>
              <Input
                id="namaSubculture"
                value={formData.namaSubculture}
                onChange={(e) => handleChange("namaSubculture", e.target.value)}
                placeholder="e.g., Batik Madura"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="penjelasan">Description *</Label>
              <Textarea
                id="penjelasan"
                value={formData.penjelasan}
                onChange={(e) => handleChange("penjelasan", e.target.value)}
                placeholder="Describe the subculture"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cultureId">Culture ID *</Label>
                <Input
                  id="cultureId"
                  type="number"
                  value={formData.cultureId}
                  onChange={(e) => handleChange("cultureId", parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusKonservasi">Conservation Status *</Label>
                <Select
                  value={formData.statusKonservasi}
                  onValueChange={(value) => handleChange("statusKonservasi", value)}
                >
                  <SelectTrigger id="statusKonservasi">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAINTAINED">Maintained</SelectItem>
                    <SelectItem value="ENDANGERED">Endangered</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Subculture"
                )}
              </Button>
              <Link href={`/admin/subculture/${params.id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}