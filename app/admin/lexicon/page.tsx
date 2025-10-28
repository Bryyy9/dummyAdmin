"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Plus, Edit2, Trash2, Eye } from "lucide-react"

interface Lexicon {
  leksikonId: number
  kataLeksikon: string
  commonMeaning: string
  status: string
  statusPreservasi: string
  domainKodifikasi?: {
    namaDomain: string
  }
}

export default function LexiconListPage() {
  const [lexicons, setLexicons] = useState<Lexicon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchLexicons()
  }, [currentPage, statusFilter])

  const fetchLexicons = async () => {
    try {
      setLoading(true)
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lexicons`)
      url.searchParams.append("page", currentPage.toString())
      url.searchParams.append("limit", "20")

      if (statusFilter !== "all") {
        url.searchParams.append("status", statusFilter)
      }

      const response = await fetch(url.toString())
      const data = await response.json()
      setLexicons(data.data || [])
    } catch (error) {
      console.error("Error fetching lexicons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lexicon?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lexicons/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLexicons(lexicons.filter((l) => l.leksikonId !== id))
      }
    } catch (error) {
      console.error("Error deleting lexicon:", error)
    }
  }

  const filteredLexicons = lexicons.filter((lexicon) =>
    lexicon.kataLeksikon.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lexicon Management</h1>
          <p className="text-muted-foreground mt-2">Manage lexicon entries and their details</p>
        </div>
        <Link href="/admin/lexicon/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Lexicon
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lexicon List</CardTitle>
          <CardDescription>View and manage all lexicon entries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search lexicon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lexicon Word</TableHead>
                    <TableHead>Meaning</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Preservation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLexicons.length > 0 ? (
                    filteredLexicons.map((lexicon) => (
                      <TableRow key={lexicon.leksikonId}>
                        <TableCell className="font-medium">{lexicon.kataLeksikon}</TableCell>
                        <TableCell>{lexicon.commonMeaning}</TableCell>
                        <TableCell>{lexicon.domainKodifikasi?.namaDomain || "-"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              lexicon.status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {lexicon.status}
                          </span>
                        </TableCell>
                        <TableCell>{lexicon.statusPreservasi}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/lexicon/${lexicon.leksikonId}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/lexicon/${lexicon.leksikonId}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(lexicon.leksikonId)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No lexicons found
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
