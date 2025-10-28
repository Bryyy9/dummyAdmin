"use client"

import { useState } from "react"
import axios from "axios"
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

interface ModalDeleteProps {
  id: number
}

export default function ModalDelete({ id }: ModalDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [productTitle, setProductTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      setIsLoading(true)
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
        setProductTitle(response.data.title)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Gagal mengambil data produk")
      } finally {
        setIsLoading(false)
      }
    }
    setIsOpen(open)
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`https://fakestoreapi.com/products/${id}`)
      toast.success("Produk berhasil dihapus")
      setIsOpen(false)
    } catch (error) {
      console.error("Error deleting data:", error)
      toast.error("Gagal menghapus produk")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Produk</DialogTitle>
          <DialogDescription>Apakah Anda yakin ingin menghapus produk ini?</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-700 mb-4">{productTitle}</p>
          <p className="text-sm text-gray-500">
            Catatan: Produk tidak akan benar-benar dihapus dari database, tetapi jika Anda mengirimkan data dengan
            sukses, API akan mengembalikan produk yang dihapus.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
