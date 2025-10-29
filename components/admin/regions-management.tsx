// "use client"

// import { useState, useEffect } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { regionsService } from "@/lib/firestore"
// import { toast } from "sonner"

// interface Region {
//   id: string
//   name: string
//   color: string
//   population: string
//   highlights: number
//   status: string
//   description?: string
// }

// export function RegionsManagement() {
//   const [regions, setRegions] = useState<Region[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  
//   const [formData, setFormData] = useState({
//     name: "",
//     color: "#3b82f6",
//     population: "",
//     description: "",
//   })

//   useEffect(() => {
//     loadRegions()
//   }, [])

//   const loadRegions = async () => {
//     try {
//       setIsLoading(true)
//       const data = await regionsService.getAll()
//       setRegions(data as Region[])
//     } catch (error) {
//       toast.error("Gagal memuat data region")
//       console.error(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       if (editingRegion) {
//         await regionsService.update(editingRegion.id, formData)
//         toast.success("Region berhasil diupdate")
//       } else {
//         await regionsService.create({
//           ...formData,
//           highlights: 0,
//           status: "active",
//         })
//         toast.success("Region berhasil ditambahkan")
//       }
//       setIsDialogOpen(false)
//       resetForm()
//       loadRegions()
//     } catch (error) {
//       toast.error("Gagal menyimpan data")
//       console.error(error)
//     }
//   }

//   const handleEdit = (region: Region) => {
//     setEditingRegion(region)
//     setFormData({
//       name: region.name,
//       color: region.color,
//       population: region.population,
//       description: region.description || "",
//     })
//     setIsDialogOpen(true)
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm("Yakin ingin menghapus region ini?")) return
    
//     try {
//       await regionsService.delete(id)
//       toast.success("Region berhasil dihapus")
//       loadRegions()
//     } catch (error) {
//       toast.error("Gagal menghapus region")
//       console.error(error)
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       color: "#3b82f6",
//       population: "",
//       description: "",
//     })
//     setEditingRegion(null)
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Regions</h1>
//           <p className="text-muted-foreground mt-1">Manage cultural regions of East Java</p>
//         </div>
//         <Dialog open={isDialogOpen} onOpenChange={(open) => {
//           setIsDialogOpen(open)
//           if (!open) resetForm()
//         }}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="w-4 h-4 mr-2" />
//               Add Region
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>{editingRegion ? "Edit" : "Add New"} Region</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Region Name</Label>
//                 <Input
//                   id="name"
//                   placeholder="e.g., Arekan"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="color">Color</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="color"
//                     type="color"
//                     value={formData.color}
//                     onChange={(e) => setFormData({ ...formData, color: e.target.value })}
//                     className="w-20 h-10"
//                   />
//                   <Input
//                     type="text"
//                     value={formData.color}
//                     onChange={(e) => setFormData({ ...formData, color: e.target.value })}
//                     placeholder="#3b82f6"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="population">Population</Label>
//                 <Input
//                   id="population"
//                   placeholder="e.g., ~5.1M"
//                   value={formData.population}
//                   onChange={(e) => setFormData({ ...formData, population: e.target.value })}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <textarea
//                   id="description"
//                   className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
//                   placeholder="Region description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 />
//               </div>
//               <Button type="submit" className="w-full">
//                 {editingRegion ? "Update" : "Save"} Region
//               </Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Regions Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {regions.length === 0 ? (
//           <div className="col-span-full text-center py-12 text-muted-foreground">
//             No regions found. Add your first region!
//           </div>
//         ) : (
//           regions.map((region) => (
//             <Card key={region.id} className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: region.color }} />
//                   <div>
//                     <h3 className="font-semibold text-foreground">{region.name}</h3>
//                     <p className="text-sm text-muted-foreground">{region.population}</p>
//                   </div>
//                 </div>
//                 <Badge variant={region.status === "active" ? "default" : "secondary"}>{region.status}</Badge>
//               </div>

//               {region.description && (
//                 <p className="text-sm text-muted-foreground mb-4">{region.description}</p>
//               )}

//               <div className="space-y-3 mb-4">
//                 <div>
//                   <p className="text-xs text-muted-foreground">Highlights</p>
//                   <p className="text-sm font-medium">{region.highlights || 0} items</p>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(region)}>
//                   <Edit2 className="w-4 h-4 mr-2" />
//                   Edit
//                 </Button>
//                 <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(region.id)}>
//                   <Trash2 className="w-4 h-4 mr-2 text-red-500" />
//                   Delete
//                 </Button>
//               </div>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }
