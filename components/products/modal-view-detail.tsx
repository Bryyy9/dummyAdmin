"use client"

import { useState } from "react"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ModalViewDetailProps {
  id: number
}

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  image: string
}

export default function ModalViewDetail({ id }: ModalViewDetailProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      setIsLoading(true)
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
        setProduct(response.data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full">View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detail Produk</DialogTitle>
          <DialogDescription>Informasi lengkap tentang produk</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : product ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img src={product.image || "/placeholder.svg"} alt={product.title} className="h-48 object-contain" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Kategori</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Harga</p>
                <p className="font-medium text-lg text-blue-600">${product.price}</p>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={() => setIsOpen(false)}>Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
