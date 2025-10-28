"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Search, Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { culturesService, type Culture, type CultureCreateInput } from "@/lib/api/cultures"
import { toast } from "sonner"

const statusKonservasiColors = {
  MAINTAINED: "bg-green-100 text-green-800",
  ENDANGERED: "bg-yellow-100 text-yellow-800",
  CRITICAL: "bg-red-100 text-red-800",
}

const statusColors = {
  PUBLISHED: "bg-blue-100 text-blue-800",
  DRAFT: "bg-gray-100 text-gray-800",
}

export default function CulturalItemsPage() {
  const [items, setItems] = useState<Culture[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Culture | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const limit = 10

  const [formData, setFormData] = useState<CultureCreateInput>({
    namaBudaya: "",
    pulauAsal: "",
    provinsi: "",
    kotaDaerah: "",
    klasifikasi: "",
    karakteristik: "",
    statusKonservasi: "MAINTAINED",
    latitude: 0,
    longitude: 0,
    status: "PUBLISHED",
  })

  useEffect(() => {
    loadItems()
  }, [currentPage])

  const loadItems = async () => {
    try {
      setIsLoading(true)
      const response = await culturesService.getAll(currentPage, limit)
      setItems(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
      setIsUsingMockData(response.message.includes("mock data"))
    } catch (error) {
      toast.error("Gagal memuat data")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.namaBudaya.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provinsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kotaDaerah.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await culturesService.update(editingItem.cultureId, formData)
        toast.success("Item berhasil diupdate")
      } else {
        await culturesService.create(formData)
        toast.success("Item berhasil ditambahkan")
      }
      setIsDialogOpen(false)
      resetForm()
      loadItems()
    } catch (error) {
      toast.error("Gagal menyimpan data")
      console.error(error)
    }
  }

  const handleEdit = (item: Culture) => {
    setEditingItem(item)
    setFormData({
      namaBudaya: item.namaBudaya,
      pulauAsal: item.pulauAsal,
      provinsi: item.provinsi,
      kotaDaerah: item.kotaDaerah,
      klasifikasi: item.klasifikasi,
      karakteristik: item.karakteristik,
      statusKonservasi: item.statusKonservasi,
      latitude: item.latitude,
      longitude: item.longitude,
      status: item.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return

    try {
      await culturesService.delete(id)
      toast.success("Item berhasil dihapus")
      loadItems()
    } catch (error) {
      toast.error("Gagal menghapus item")
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({
      namaBudaya: "",
      pulauAsal: "",
      provinsi: "",
      kotaDaerah: "",
      klasifikasi: "",
      karakteristik: "",
      statusKonservasi: "MAINTAINED",
      latitude: 0,
      longitude: 0,
      status: "PUBLISHED",
    })
    setEditingItem(null)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) resetForm()
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
              environment variables.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cultural Items</h1>
          <p className="text-muted-foreground mt-1">Kelola budaya Indonesia ({total} total items)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add New"} Cultural Item</DialogTitle>
              <DialogDescription>
                Fill in the details to {editingItem ? "update" : "add"} a cultural item.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="namaBudaya">Nama Budaya *</Label>
                  <Input
                    id="namaBudaya"
                    placeholder="e.g., Budaya Jawa"
                    value={formData.namaBudaya}
                    onChange={(e) => setFormData({ ...formData, namaBudaya: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pulauAsal">Pulau Asal *</Label>
                  <Input
                    id="pulauAsal"
                    placeholder="e.g., Jawa"
                    value={formData.pulauAsal}
                    onChange={(e) => setFormData({ ...formData, pulauAsal: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provinsi">Provinsi *</Label>
                  <Input
                    id="provinsi"
                    placeholder="e.g., Jawa Timur"
                    value={formData.provinsi}
                    onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="kotaDaerah">Kota/Daerah *</Label>
                  <Input
                    id="kotaDaerah"
                    placeholder="e.g., Malang"
                    value={formData.kotaDaerah}
                    onChange={(e) => setFormData({ ...formData, kotaDaerah: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="klasifikasi">Klasifikasi *</Label>
                <Input
                  id="klasifikasi"
                  placeholder="e.g., Orangnya medok"
                  value={formData.klasifikasi}
                  onChange={(e) => setFormData({ ...formData, klasifikasi: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="karakteristik">Karakteristik *</Label>
                <textarea
                  id="karakteristik"
                  className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Deskripsi karakteristik budaya"
                  value={formData.karakteristik}
                  onChange={(e) => setFormData({ ...formData, karakteristik: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="statusKonservasi">Status Konservasi *</Label>
                  <select
                    id="statusKonservasi"
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.statusKonservasi}
                    onChange={(e) => setFormData({ ...formData, statusKonservasi: e.target.value as any })}
                    required
                  >
                    <option value="MAINTAINED">Maintained</option>
                    <option value="ENDANGERED">Endangered</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status Publikasi *</Label>
                  <select
                    id="status"
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    required
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -7.9797"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 112.6304"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingItem ? "Update" : "Save"} Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, province, or city..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Nama Budaya</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Lokasi</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Klasifikasi</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status Konservasi</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.cultureId} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{item.namaBudaya}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium">{item.kotaDaerah}</p>
                        <p className="text-xs text-muted-foreground">{item.provinsi}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{item.klasifikasi}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={statusKonservasiColors[item.statusKonservasi]}>{item.statusKonservasi}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={statusColors[item.status]}>{item.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.cultureId)}>
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
          Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total} results
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
