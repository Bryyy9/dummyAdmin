"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  Calendar,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { referencesService, type Reference, type ReferenceCreateInput } from "@/lib/api/references"
import { toast } from "sonner"

const referenceTypeColors: Record<string, string> = {
  JURNAL: "bg-blue-100 text-blue-800",
  BUKU: "bg-purple-100 text-purple-800",
  ARTIKEL: "bg-green-100 text-green-800",
  WEBSITE: "bg-orange-100 text-orange-800",
  LAPORAN: "bg-red-100 text-red-800",
}

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  DRAFT: "bg-gray-100 text-gray-800",
}

export default function ReferencesPage() {
  const [references, setReferences] = useState<Reference[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingReference, setEditingReference] = useState<Reference | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const limit = 10

  const [formData, setFormData] = useState<ReferenceCreateInput>({
    judul: "",
    tipeReferensi: "ARTIKEL",
    penjelasan: "",
    url: "",
    penulis: "",
    tahunTerbit: "",
    status: "DRAFT",
  })

  useEffect(() => {
    loadReferences()
  }, [currentPage])

  const loadReferences = async () => {
    try {
      setIsLoading(true)
      const response = await referencesService.getAll(currentPage, limit)
      setReferences(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
      setIsUsingMockData(response.message.includes("mock data"))
      console.log("[v0] References loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading references:", error)
      toast.error("Gagal memuat data referensi")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReferences = references.filter(
    (reference) =>
      reference.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reference.penulis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reference.penjelasan?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingReference) {
        await referencesService.update(editingReference.referensiId, formData)
        toast.success("Referensi berhasil diupdate")
      } else {
        await referencesService.create(formData)
        toast.success("Referensi berhasil ditambahkan")
      }
      setIsDialogOpen(false)
      resetForm()
      loadReferences()
    } catch (error) {
      toast.error("Gagal menyimpan data")
      console.error(error)
    }
  }

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference)
    setFormData({
      judul: reference.judul,
      tipeReferensi: reference.tipeReferensi,
      penjelasan: reference.penjelasan || "",
      url: reference.url || "",
      penulis: reference.penulis || "",
      tahunTerbit: reference.tahunTerbit || "",
      status: reference.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus referensi ini?")) return

    try {
      await referencesService.delete(id)
      toast.success("Referensi berhasil dihapus")
      loadReferences()
    } catch (error) {
      toast.error("Gagal menghapus referensi")
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({
      judul: "",
      tipeReferensi: "ARTIKEL",
      penjelasan: "",
      url: "",
      penulis: "",
      tahunTerbit: "",
      status: "DRAFT",
    })
    setEditingReference(null)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) resetForm()
  }

  const getReferenceTypeColor = (type: string) => {
    return referenceTypeColors[type] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    return statusColors[status] || "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {isUsingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Menggunakan Data Mock</p>
            <p className="text-sm text-yellow-700 mt-1">
              API tidak tersedia. Pastikan{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">NEXT_PUBLIC_API_URL</code> sudah di-set di
              environment variables. Contoh:{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">http://localhost:8000/api/v1</code>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Referensi</h1>
          <p className="text-muted-foreground mt-1">Kelola referensi budaya ({total} total referensi)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Referensi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingReference ? "Edit" : "Tambah"} Referensi</DialogTitle>
              <DialogDescription>
                Isi detail untuk {editingReference ? "mengupdate" : "menambahkan"} referensi baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="judul">Judul *</Label>
                <Input
                  id="judul"
                  placeholder="e.g., Budaya Jawa Timur: Sejarah dan Perkembangan"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipeReferensi">Tipe Referensi *</Label>
                  <Select
                    value={formData.tipeReferensi}
                    onValueChange={(value) => setFormData({ ...formData, tipeReferensi: value as any })}
                  >
                    <SelectTrigger id="tipeReferensi">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JURNAL">Jurnal</SelectItem>
                      <SelectItem value="BUKU">Buku</SelectItem>
                      <SelectItem value="ARTIKEL">Artikel</SelectItem>
                      <SelectItem value="WEBSITE">Website</SelectItem>
                      <SelectItem value="LAPORAN">Laporan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="penjelasan">Penjelasan</Label>
                <Input
                  id="penjelasan"
                  placeholder="Deskripsi singkat tentang referensi"
                  value={formData.penjelasan}
                  onChange={(e) => setFormData({ ...formData, penjelasan: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="penulis">Penulis</Label>
                  <Input
                    id="penulis"
                    placeholder="e.g., Prof. Soemanto"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tahunTerbit">Tahun Terbit</Label>
                  <Input
                    id="tahunTerbit"
                    placeholder="e.g., 2023"
                    value={formData.tahunTerbit}
                    onChange={(e) => setFormData({ ...formData, tahunTerbit: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/referensi"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                {editingReference ? "Update" : "Simpan"} Referensi
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari berdasarkan judul, penulis, atau penjelasan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Judul</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tipe</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Penulis</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tahun</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReferences.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Tidak ada referensi ditemukan
                  </td>
                </tr>
              ) : (
                filteredReferences.map((reference) => (
                  <tr key={reference.referensiId} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium max-w-xs">
                      <div className="truncate" title={reference.judul}>
                        {reference.judul}
                      </div>
                      {reference.penjelasan && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{reference.penjelasan}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={getReferenceTypeColor(reference.tipeReferensi)}>
                        {reference.tipeReferensi}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">{reference.penulis || "-"}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {reference.tahunTerbit || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={getStatusColor(reference.status)}>{reference.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {reference.url && (
                          <a
                            href={reference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title="Buka URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(reference)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(reference.referensiId)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {(currentPage - 1) * limit + 1} hingga {Math.min(currentPage * limit, total)} dari {total} hasil
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
