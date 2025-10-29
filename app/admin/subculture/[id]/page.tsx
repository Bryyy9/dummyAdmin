"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"

interface Subculture {
  subcultureId: number
  namaSubculture: string
  penjelasan: string
  cultureId: number
  status: string
  statusKonservasi: string
  createdAt: string
  updatedAt: string
}

export default function SubcultureDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [subculture, setSubculture] = useState<Subculture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubculture = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcultures/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch subculture")
        const data = await response.json()
        setSubculture(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSubculture()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this subculture?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcultures/${params.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete subculture")
      router.push("/admin/subculture")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !subculture) {
    return (
      <div className="p-6">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error || "Subculture not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/subculture">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{subculture.namaSubculture}</h1>
            <p className="text-muted-foreground mt-1">Subculture Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/subculture/${params.id}/edit`}>
            <Button className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>General information about this subculture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{subculture.namaSubculture}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Culture ID</p>
              <p className="font-medium">{subculture.cultureId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={subculture.status === "PUBLISHED" ? "default" : "secondary"}>
                {subculture.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conservation Status</p>
              <Badge
                variant={
                  subculture.statusKonservasi === "MAINTAINED"
                    ? "default"
                    : subculture.statusKonservasi === "ENDANGERED"
                      ? "secondary"
                      : "destructive"
                }
              >
                {subculture.statusKonservasi}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Description</p>
            <p className="text-sm">{subculture.penjelasan}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="text-sm">{new Date(subculture.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="text-sm">{new Date(subculture.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}