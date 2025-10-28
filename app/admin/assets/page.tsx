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
  FileText,
  Music,
  Video,
  Cable as Cube,
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
import { assetsService, type Asset, type AssetCreateInput } from "@/lib/api/assets"
import { toast } from "sonner"

const assetTypeColors: Record<string, string> = {
  FOTO: "bg-blue-100 text-blue-800",
  VIDEO: "bg-purple-100 text-purple-800",
  AUDIO: "bg-green-100 text-green-800",
  MODEL_3D: "bg-orange-100 text-orange-800",
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
  CORRUPTED: "bg-red-100 text-red-800",
}

const assetTypeIcons: Record<string, React.ReactNode> = {
  FOTO: <FileText className="w-4 h-4" />,
  VIDEO: <Video className="w-4 h-4" />,
  AUDIO: <Music className="w-4 h-4" />,
  MODEL_3D: <Cube className="w-4 h-4" />,
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const limit = 10

  const [formData, setFormData] = useState<AssetCreateInput>({
    namaFile: "",
    tipe: "FOTO",
    penjelasan: "",
    url: "",
    status: "ACTIVE",
  })

  useEffect(() => {
    loadAssets()
  }, [currentPage])

  const loadAssets = async () => {
    try {
      setIsLoading(true)
      const response = await assetsService.getAll(currentPage, limit)
      setAssets(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
      setIsUsingMockData(response.message.includes("mock data"))
      console.log("[v0] Assets loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading assets:", error)
      toast.error("Gagal memuat data aset")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAssets = assets.filter(
    (asset) =>
      asset.namaFile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.penjelasan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tipe.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingAsset) {
        await assetsService.update(editingAsset.assetId, formData)
        toast.success("Aset berhasil diupdate")
      } else {
        await assetsService.create(formData)
        toast.success("Aset berhasil ditambahkan")
      }
      setIsDialogOpen(false)
      resetForm()
      loadAssets()
    } catch (error) {
      toast.error("Gagal menyimpan data")
      console.error(error)
    }
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setFormData({
      namaFile: asset.namaFile,
      tipe: asset.tipe,
      penjelasan: asset.penjelasan || "",
      url: asset.url || "",
      status: asset.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus aset ini?")) return

    try {
      await assetsService.delete(id)
      toast.success("Aset berhasil dihapus")
      loadAssets()
    } catch (error) {
      toast.error("Gagal menghapus aset")
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({
      namaFile: "",
      tipe: "FOTO",
      penjelasan: "",
      url: "",
      status: "ACTIVE",
    })
    setEditingAsset(null)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) resetForm()
  }

  const getAssetTypeColor = (type: string) => {
    return assetTypeColors[type] || "bg-gray-100 text-gray-800"
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
          <h1 className="text-3xl font-bold text-foreground">Asset</h1>
          <p className="text-muted-foreground mt-1">Kelola aset digital ({total} total aset)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Aset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAsset ? "Edit" : "Tambah"} Aset</DialogTitle>
              <DialogDescription>
                Isi detail untuk {editingAsset ? "mengupdate" : "menambahkan"} aset baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="namaFile">Nama File *</Label>
                <Input
                  id="namaFile"
                  placeholder="e.g., batik-jawa-timur.jpg"
                  value={formData.namaFile}
                  onChange={(e) => setFormData({ ...formData, namaFile: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipe">Tipe Aset *</Label>
                  <Select
                    value={formData.tipe}
                    onValueChange={(value) => setFormData({ ...formData, tipe: value as any })}
                  >
                    <SelectTrigger id="tipe">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOTO">Foto</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="AUDIO">Audio</SelectItem>
                      <SelectItem value="MODEL_3D">Model 3D</SelectItem>
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
                      <SelectItem value="ACTIVE">Aktif</SelectItem>
                      <SelectItem value="PROCESSING">Sedang Diproses</SelectItem>
                      <SelectItem value="ARCHIVED">Diarsipkan</SelectItem>
                      <SelectItem value="CORRUPTED">Rusak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="penjelasan">Penjelasan</Label>
                <Input
                  id="penjelasan"
                  placeholder="Deskripsi singkat tentang aset"
                  value={formData.penjelasan}
                  onChange={(e) => setFormData({ ...formData, penjelasan: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/asset.jpg"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                {editingAsset ? "Update" : "Simpan"} Aset
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari berdasarkan nama file, tipe, atau penjelasan..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Nama File</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tipe</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Penjelasan</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Dibuat</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Tidak ada aset ditemukan
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.assetId} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium max-w-xs">
                      <div className="truncate" title={asset.namaFile}>
                        {asset.namaFile}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={getAssetTypeColor(asset.tipe)} variant="outline">
                        <span className="mr-2">{assetTypeIcons[asset.tipe]}</span>
                        {asset.tipe}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs">
                      <div className="truncate text-muted-foreground">{asset.penjelasan || "-"}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(asset.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {asset.url && (
                          <a
                            href={asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title="Buka URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(asset)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(asset.assetId)}>
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
