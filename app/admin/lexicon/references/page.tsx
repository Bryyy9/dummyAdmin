"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface LexiconReference {
  leksikonId: number
  referensiId: number
  citationNote: string
  createdAt: string
  kataLeksikon: string
  referensi: {
    referensiId: number
    judul: string
    tipeReferensi: string
    penjelasan?: string
    url?: string
    penulis?: string
    tahunTerbit?: string
    status: string
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-corpora.vercel.app/api/v1"

export default function LexiconReferencesPage() {
  const [references, setReferences] = useState<LexiconReference[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    fetchReferences()
  }, [])

  const fetchReferences = async () => {
    try {
      setLoading(true)
      setProgress({ current: 0, total: 0 })

      // Step 1: Fetch all lexicons
      console.log("Fetching lexicons from:", `${API_BASE_URL}/leksikons`)
      const lexiconsResponse = await fetch(`${API_BASE_URL}/leksikons`, {
        headers: { "Content-Type": "application/json" },
      })

      if (!lexiconsResponse.ok) {
        throw new Error(`Failed to fetch lexicons: ${lexiconsResponse.status}`)
      }

      const lexiconsData = await lexiconsResponse.json()
      const lexicons = Array.isArray(lexiconsData) ? lexiconsData : lexiconsData.data || []

      console.log(`Found ${lexicons.length} lexicons`)
      setProgress({ current: 0, total: lexicons.length })

      // Step 2: Fetch references for each lexicon
      const allReferences: LexiconReference[] = []

      for (let i = 0; i < lexicons.length; i++) {
        const lexicon = lexicons[i]
        setProgress({ current: i + 1, total: lexicons.length })

        try {
          // PERBAIKAN: gunakan /references bukan /referensi
          const refsResponse = await fetch(`${API_BASE_URL}/leksikons/${lexicon.leksikonId}/references`, {
            headers: { "Content-Type": "application/json" },
          })

          if (refsResponse.ok) {
            const refsData = await refsResponse.json()
            const lexiconRefs: LexiconReference[] = Array.isArray(refsData) ? refsData : refsData.data || []

            // Add lexicon name to each reference
            lexiconRefs.forEach((ref) => {
              allReferences.push({
                ...ref,
                kataLeksikon: lexicon.kataLeksikon,
              })
            })

            console.log(`Lexicon ${lexicon.kataLeksikon}: ${lexiconRefs.length} references`)
          } else {
            console.log(`No references found for lexicon ${lexicon.leksikonId} (status: ${refsResponse.status})`)
          }
        } catch (error) {
          console.error(`Error fetching references for lexicon ${lexicon.leksikonId}:`, error)
          // Continue with next lexicon
        }
      }

      console.log(`Total references found: ${allReferences.length}`)
      setReferences(allReferences)
      
      if (allReferences.length > 0) {
        toast.success(`Loaded ${allReferences.length} lexicon references`)
      }
    } catch (error) {
      console.error("Error fetching references:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch lexicon references")
    } finally {
      setLoading(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  const handleRemoveReference = async (leksikonId: number, referensiId: number) => {
    if (!confirm("Are you sure you want to remove this reference?")) return

    try {
      // PERBAIKAN: gunakan /references bukan /referensi
      const response = await fetch(`${API_BASE_URL}/leksikons/${leksikonId}/references/${referensiId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success("Reference removed successfully")
      setReferences(references.filter((r) => !(r.leksikonId === leksikonId && r.referensiId === referensiId)))
    } catch (error) {
      console.error("Error removing reference:", error)
      toast.error(error instanceof Error ? error.message : "Failed to remove reference")
    }
  }

  const filteredReferences = references.filter(
    (ref) =>
      ref.kataLeksikon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.referensi?.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.citationNote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.referensi?.penulis?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getReferenceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      JURNAL: "bg-blue-100 text-blue-800",
      BUKU: "bg-purple-100 text-purple-800",
      ARTIKEL: "bg-green-100 text-green-800",
      WEBSITE: "bg-orange-100 text-orange-800",
      LAPORAN: "bg-red-100 text-red-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    return status === "PUBLISHED" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading lexicon references...</p>
          {progress.total > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Processing {progress.current} of {progress.total} lexicons
              </p>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lexicon References</h1>
          <p className="text-muted-foreground mt-2">Manage references linked to lexicon entries</p>
        </div>
        <Button onClick={fetchReferences} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {references.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">No References Found</p>
            <p className="text-sm text-yellow-700 mt-1">
              There are no references linked to any lexicon entries yet. References can be linked when creating or
              editing lexicon entries.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>References List</CardTitle>
          <CardDescription>View and manage lexicon references ({references.length} total)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search by lexicon word, reference title, author, or citation note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lexicon Word</TableHead>
                  <TableHead>Reference Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Citation Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferences.length > 0 ? (
                  filteredReferences.map((ref) => (
                    <TableRow key={`${ref.leksikonId}-${ref.referensiId}`}>
                      <TableCell className="font-medium">{ref.kataLeksikon || "-"}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{ref.referensi?.judul || "-"}</p>
                          {ref.referensi?.penjelasan && (
                            <p className="text-xs text-muted-foreground truncate">{ref.referensi.penjelasan}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getReferenceTypeColor(ref.referensi?.tipeReferensi || "")} variant="outline">
                          {ref.referensi?.tipeReferensi || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>{ref.referensi?.penulis || "-"}</TableCell>
                      <TableCell>{ref.referensi?.tahunTerbit || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ref.referensi?.status || "DRAFT")}>
                          {ref.referensi?.status || "DRAFT"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-muted-foreground text-sm">
                          {ref.citationNote || "-"}
                        </div>
                      </TableCell>
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
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No references found matching your search" : "No references linked to lexicon entries"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}