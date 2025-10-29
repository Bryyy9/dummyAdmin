"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

interface Subculture {
  subcultureId: number
  namaSubculture: string
  penjelasan: string
  cultureId: number
  status: string
  statusKonservasi: string
}

export default function SubcultureListPage() {
  const [subcultures, setSubcultures] = useState<Subculture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubcultures = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcultures`)
        if (!response.ok) throw new Error("Failed to fetch subcultures")
        const data = await response.json()
        setSubcultures(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSubcultures()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subculture?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcultures/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete subculture")
      setSubcultures(subcultures.filter((s) => s.subcultureId !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subculture Management</h1>
          <p className="text-muted-foreground mt-2">Manage cultural subcultures and their details</p>
        </div>
        <Link href="/admin/subculture/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Subculture
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Loading subcultures...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {subcultures.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">No subcultures found</p>
              </CardContent>
            </Card>
          ) : (
            subcultures.map((subculture) => (
              <Card key={subculture.subcultureId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle>{subculture.namaSubculture}</CardTitle>
                      <CardDescription className="mt-2">{subculture.penjelasan}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/subculture/${subculture.subcultureId}`}>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/subculture/${subculture.subcultureId}/edit`}>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleDelete(subculture.subcultureId)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">{subculture.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conservation Status</p>
                      <p className="font-medium">{subculture.statusKonservasi}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
