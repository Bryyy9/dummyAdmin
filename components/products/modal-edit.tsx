"use client"

import { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ModalEditProps {
  id: number
}

interface FormData {
  title: string
  description: string
  category: string
  price: string
}

export default function ModalEdit({ id }: ModalEditProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    price: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    defaultValues: formData,
  })

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      setIsLoading(true)
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
        setFormData(response.data)
        form.reset(response.data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Gagal mengambil data produk")
      } finally {
        setIsLoading(false)
      }
    }
    setIsOpen(open)
  }

  const handleUpdate = async (data: FormData) => {
    try {
      setIsLoading(true)
      const response = await axios.put(`https://fakestoreapi.com/products/${id}`, data)
      console.log("Update successful:", response.data)
      toast.success("Produk berhasil diperbarui")
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating data:", error)
      toast.error("Gagal memperbarui produk")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
          <DialogDescription>Perbarui informasi produk di bawah ini</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input id="title" placeholder="Judul produk" {...form.register("title")} />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Input id="description" placeholder="Deskripsi produk" {...form.register("description")} />
          </div>
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Input id="category" placeholder="Kategori" {...form.register("category")} />
          </div>
          <div>
            <Label htmlFor="price">Harga</Label>
            <Input id="price" placeholder="Harga" {...form.register("price")} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
