"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

interface LexiconReference {
  leksikonId: number
  referensiId: number
  citationNote: string
  kataLeksikon: string
  judul: string
}

export default function LexiconReferencesPage() {
  const [references, setReferences] = useState<LexiconReference[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReferences()
  }, [])

  const fetchReferences = async () => {
    try {
      setLoading(true)
      // This would fetch all lexicon references - adjust endpoint as needed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lexicons`)
      const data = await response.json()
      // Process data to extract references
      setReferences([])
    } catch (error) {
      console.error("Error fetching references:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveReference = async (leksikonId: number, referensiId: number) => {
    if (!confirm("Are you sure you want to remove this reference?")) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lexicons/${leksikonId}/references/${referensiId}`,
        { method: "DELETE" },
      )

      if (response.ok) {
        setReferences(references.filter((r) => !(r.leksikonId === leksikonId && r.referensiId === referensiId)))
      }
    } catch (error) {
      console.error("Error removing reference:", error)
    }
  }

  const filteredReferences = references.filter(
    (ref) =>
      ref.kataLeksikon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.judul.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lexicon References</h1>
        <p className="text-muted-foreground mt-2">Manage references linked to lexicon entries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>References List</CardTitle>
          <CardDescription>View and manage lexicon references</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search lexicon or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lexicon Word</TableHead>
                    <TableHead>Reference Title</TableHead>
                    <TableHead>Citation Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferences.length > 0 ? (
                    filteredReferences.map((ref) => (
                      <TableRow key={`${ref.leksikonId}-${ref.referensiId}`}>
                        <TableCell className="font-medium">{ref.kataLeksikon}</TableCell>
                        <TableCell>{ref.judul}</TableCell>
                        <TableCell>{ref.citationNote}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveReference(ref.leksikonId, ref.referensiId)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No references found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
