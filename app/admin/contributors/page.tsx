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
  Mail,
  Phone,
  Building2,
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
import { contributorsService, type Contributor, type ContributorCreateInput } from "@/lib/api/contributors"
import { toast } from "sonner"

const expertiseAreaColors: Record<string, string> = {
  "Frontend Development": "bg-blue-100 text-blue-800",
  "Backend Development": "bg-purple-100 text-purple-800",
  "Fullstack Development": "bg-indigo-100 text-indigo-800",
  "Data Science": "bg-green-100 text-green-800",
  DevOps: "bg-orange-100 text-orange-800",
  "UI/UX Design": "bg-pink-100 text-pink-800",
  "Budaya Jawa": "bg-amber-100 text-amber-800",
  "Budaya Indonesia": "bg-teal-100 text-teal-800",
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const limit = 10

  const [formData, setFormData] = useState<ContributorCreateInput>({
    namaContributor: "",
    institusi: "",
    email: "",
    expertiseArea: "",
    contactInfo: "",
  })

  useEffect(() => {
    loadContributors()
  }, [currentPage])

  const loadContributors = async () => {
    try {
      setIsLoading(true)
      const response = await contributorsService.getAll(currentPage, limit)
      setContributors(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
      setIsUsingMockData(response.message.includes("mock data"))
    } catch (error) {
      toast.error("Gagal memuat data contributor")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredContributors = contributors.filter(
    (contributor) =>
      contributor.namaContributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.institusi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.expertiseArea.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingContributor) {
        await contributorsService.update(editingContributor.contributorId, formData)
        toast.success("Contributor berhasil diupdate")
      } else {
        await contributorsService.create(formData)
        toast.success("Contributor berhasil ditambahkan")
      }
      setIsDialogOpen(false)
      resetForm()
      loadContributors()
    } catch (error) {
      toast.error("Gagal menyimpan data")
      console.error(error)
    }
  }

  const handleEdit = (contributor: Contributor) => {
    setEditingContributor(contributor)
    setFormData({
      namaContributor: contributor.namaContributor,
      institusi: contributor.institusi,
      email: contributor.email,
      expertiseArea: contributor.expertiseArea,
      contactInfo: contributor.contactInfo,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus contributor ini?")) return

    try {
      await contributorsService.delete(id)
      toast.success("Contributor berhasil dihapus")
      loadContributors()
    } catch (error) {
      toast.error("Gagal menghapus contributor")
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({
      namaContributor: "",
      institusi: "",
      email: "",
      expertiseArea: "",
      contactInfo: "",
    })
    setEditingContributor(null)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) resetForm()
  }

  const getExpertiseAreaColor = (area: string) => {
    return expertiseAreaColors[area] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
          <h1 className="text-3xl font-bold text-foreground">Contributors</h1>
          <p className="text-muted-foreground mt-1">Kelola kontributor budaya ({total} total contributors)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Contributor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingContributor ? "Edit" : "Add New"} Contributor</DialogTitle>
              <DialogDescription>
                Fill in the details to {editingContributor ? "update" : "add"} a contributor.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="namaContributor">Nama Contributor *</Label>
                <Input
                  id="namaContributor"
                  placeholder="e.g., Dr. Budi Santoso"
                  value={formData.namaContributor}
                  onChange={(e) => setFormData({ ...formData, namaContributor: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="institusi">Institusi *</Label>
                  <Input
                    id="institusi"
                    placeholder="e.g., Universitas Airlangga"
                    value={formData.institusi}
                    onChange={(e) => setFormData({ ...formData, institusi: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., budi@unair.ac.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expertiseArea">Bidang Keahlian *</Label>
                  <Input
                    id="expertiseArea"
                    placeholder="e.g., Budaya Jawa"
                    value={formData.expertiseArea}
                    onChange={(e) => setFormData({ ...formData, expertiseArea: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactInfo">Informasi Kontak *</Label>
                  <Input
                    id="contactInfo"
                    placeholder="e.g., +62-31-1234567"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingContributor ? "Update" : "Save"} Contributor
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, institution, email, or expertise area..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Institusi</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Bidang Keahlian</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Kontak</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Terdaftar</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContributors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No contributors found
                  </td>
                </tr>
              ) : (
                filteredContributors.map((contributor) => (
                  <tr key={contributor.contributorId} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{contributor.namaContributor}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{contributor.institusi}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${contributor.email}`} className="text-blue-600 hover:underline">
                          {contributor.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={getExpertiseAreaColor(contributor.expertiseArea)}>
                        {contributor.expertiseArea}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${contributor.contactInfo}`} className="hover:underline">
                          {contributor.contactInfo}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(contributor.registeredAt)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(contributor)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(contributor.contributorId)}>
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
