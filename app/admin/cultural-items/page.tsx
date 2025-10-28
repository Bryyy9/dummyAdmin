"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { culturalItemsService } from "@/lib/firestore"
import { toast } from "sonner"

interface CulturalItem {
  id: string
  title: string
  category: string
  region: string
  description: string
  popularity: number
  lastUpdated: string
}

const categoryColors = {
  tari: "bg-blue-100 text-blue-800",
  batik: "bg-purple-100 text-purple-800",
  makanan: "bg-orange-100 text-orange-800",
  musik: "bg-green-100 text-green-800",
  kerajinan: "bg-pink-100 text-pink-800",
  wayang: "bg-indigo-100 text-indigo-800",
  bahasa: "bg-cyan-100 text-cyan-800",
}

export function CulturalItemsManagement() {
  const [items, setItems] = useState<CulturalItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<CulturalItem | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    region: "",
    description: "",
    popularity: 0,
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setIsLoading(true)
      const data = await culturalItemsService.getAll()
      setItems(data as CulturalItem[])
    } catch (error) {
      toast.error("Gagal memuat data")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await culturalItemsService.update(editingItem.id, formData)
        toast.success("Item berhasil diupdate")
      } else {
        await culturalItemsService.create(formData)
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

  const handleEdit = (item: CulturalItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      category: item.category,
      region: item.region,
      description: item.description,
      popularity: item.popularity,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return
    
    try {
      await culturalItemsService.delete(id)
      toast.success("Item berhasil dihapus")
      loadItems()
    } catch (error) {
      toast.error("Gagal menghapus item")
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      region: "",
      description: "",
      popularity: 0,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cultural Items</h1>
          <p className="text-muted-foreground mt-1">Manage all cultural items in the database</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add New"} Cultural Item</DialogTitle>
              <DialogDescription>
                Fill in the details to {editingItem ? "update" : "add"} a cultural item.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Item title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Pilih kategori</option>
                  <option value="tari">Tari</option>
                  <option value="batik">Batik</option>
                  <option value="makanan">Makanan</option>
                  <option value="musik">Musik</option>
                  <option value="kerajinan">Kerajinan</option>
                  <option value="wayang">Wayang</option>
                  <option value="bahasa">Bahasa</option>
                </select>
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <select
                  id="region"
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  required
                >
                  <option value="">Pilih region</option>
                  <option value="Arekan">Arekan</option>
                  <option value="Madura">Madura</option>
                  <option value="Mataraman">Mataraman</option>
                  <option value="Osing">Osing</option>
                </select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="popularity">Popularity (0-100)</Label>
                <Input
                  id="popularity"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Popularity"
                  value={formData.popularity}
                  onChange={(e) => setFormData({ ...formData, popularity: parseInt(e.target.value) })}
                  required
                />
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
          placeholder="Search items..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Region</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Popularity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">{item.region}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${item.popularity}%` }} />
                        </div>
                        <span className="text-xs font-medium">{item.popularity}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
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
    </div>
  )
}