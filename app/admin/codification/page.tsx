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
  Calendar,
  Code,
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
import {
  domainKodifikasiService,
  type DomainKodifikasi,
  type DomainKodifikasiCreateInput,
} from "@/lib/api/domain-kodifikasi"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  DRAFT: "bg-yellow-100 text-yellow-800",
}

export default function CodificationPage() {
  const [domains, setDomains] = useState<DomainKodifikasi[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingDomain, setEditingDomain] = useState<DomainKodifikasi | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const limit = 10

  const [formData, setFormData] = useState<DomainKodifikasiCreateInput>({
    kode: "",
    namaDomain: "",
    penjelasan: "",
    subcultureId: 1,
    status: "PUBLISHED",
  })

  useEffect(() => {
    loadDomains()
  }, [currentPage])

  const loadDomains = async () => {
    try {
      setIsLoading(true)
      const response = await domainKodifikasiService.getAll(currentPage, limit)
      setDomains(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
      setIsUsingMockData(response.message.includes("mock data"))
      console.log("[v0] Domains loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading domains:", error)
      toast.error("Gagal memuat data domain")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDomains = domains.filter(
    (domain) =>
      domain.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.namaDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.penjelasan.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingDomain) {
        await domainKodifikasiService.update(editingDomain.domainKodifikasiId, formData)
        toast.success("Domain berhasil diupdate")
      } else {
        await domainKodifikasiService.create(formData)
        toast.success("Domain berhasil ditambahkan")
      }
      setIsDialogOpen(false)
      resetForm()
      loadDomains()
    } catch (error) {
      toast.error("Gagal menyimpan data")
      console.error(error)
    }
  }

  const handleEdit = (domain: DomainKodifikasi) => {
    setEditingDomain(domain)
    setFormData({
      kode: domain.kode,
      namaDomain: domain.namaDomain,
      penjelasan: domain.penjelasan,
      subcultureId: domain.subcultureId,
      status: domain.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus domain ini?")) return

    try {
      await domainKodifikasiService.delete(id)
      toast.success("Domain berhasil dihapus")
      loadDomains()
    } catch (error) {
      toast.error("Gagal menghapus domain")
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({
      kode: "",
      namaDomain: "",
      penjelasan: "",
      subcultureId: 1,
      status: "PUBLISHED",
    })
    setEditingDomain(null)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) resetForm()
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
          <h1 className="text-3xl font-bold text-foreground">Codification</h1>
          <p className="text-muted-foreground mt-1">Kelola domain kodifikasi budaya ({total} total domain)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDomain ? "Edit" : "Tambah"} Domain Kodifikasi</DialogTitle>
              <DialogDescription>
                Isi detail untuk {editingDomain ? "mengupdate" : "menambahkan"} domain kodifikasi baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="kode">Kode Domain *</Label>
                  <Input
                    id="kode"
                    placeholder="e.g., AK, TT, DA"
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subcultureId">Subculture ID *</Label>
                  <Input
                    id="subcultureId"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.subcultureId}
                    onChange={(e) => setFormData({ ...formData, subcultureId: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="namaDomain">Nama Domain *</Label>
                <Input
                  id="namaDomain"
                  placeholder="e.g., Agama dan Kepercayaan Tengger"
                  value={formData.namaDomain}
                  onChange={(e) => setFormData({ ...formData, namaDomain: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="penjelasan">Penjelasan *</Label>
                <Input
                  id="penjelasan"
                  placeholder="Deskripsi lengkap tentang domain"
                  value={formData.penjelasan}
                  onChange={(e) => setFormData({ ...formData, penjelasan: e.target.value })}
                  required
                />
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
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {editingDomain ? "Update" : "Simpan"} Domain
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari berdasarkan kode, nama, atau penjelasan..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Kode</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nama Domain</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Penjelasan</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Dibuat</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDomains.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Tidak ada domain ditemukan
                  </td>
                </tr>
              ) : (
                filteredDomains.map((domain) => (
                  <tr key={domain.domainKodifikasiId} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Code className="w-3 h-3 mr-1" />
                        {domain.kode}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium max-w-xs">
                      <div className="truncate" title={domain.namaDomain}>
                        {domain.namaDomain}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs">
                      <div className="truncate text-muted-foreground">{domain.penjelasan}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={getStatusColor(domain.status)}>{domain.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(domain.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(domain)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(domain.domainKodifikasiId)}>
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
