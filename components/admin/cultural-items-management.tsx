"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const mockItems = [
  {
    id: 1,
    title: "Tari Reog Ponorogo",
    category: "tari",
    region: "Ponorogo",
    popularity: 95,
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    title: "Batik Malangan",
    category: "batik",
    region: "Malang",
    popularity: 88,
    lastUpdated: "2024-01-10",
  },
  {
    id: 3,
    title: "Rujak Cingur",
    category: "makanan",
    region: "Surabaya",
    popularity: 92,
    lastUpdated: "2024-01-12",
  },
]

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
  const [items, setItems] = useState(mockItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cultural Items</h1>
          <p className="text-muted-foreground mt-1">Manage all cultural items in the database</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cultural Item</DialogTitle>
              <DialogDescription>Fill in the details to add a new cultural item to the database.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Item title" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input placeholder="Category" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Region</label>
                <Input placeholder="Region" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Description" className="mt-1" />
              </div>
              <Button className="w-full">Save Item</Button>
            </div>
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Last Updated</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
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
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.lastUpdated}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
