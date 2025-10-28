"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import axios from "axios"
import { useParams } from "next/navigation"

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  image: string
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const id = params.id

  useEffect(() => {
    const getProductDetail = async () => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
        setProduct(response.data)
      } catch (error) {
        console.error("Error fetching product detail:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      getProductDetail()
    }
  }, [id])

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">Produk tidak ditemukan</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="bg-white py-4 px-3 my-4 rounded-xl flex bg-red-200">
          <h4 className="font-medium text-black">
            Detail Product of&nbsp;
            <span className="font-bold text-blue-500">{product.title}</span>
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 p-5 bg-white rounded-xl bg-red-200">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="md:col-span-2 p-5 bg-white rounded-lg space-y-4">
            <div>
              <p className="text-2xl font-medium text-gray-900">{product.title}</p>
            </div>
            <div>
              <p className="text-gray-700">{product.description}</p>
            </div>
            <div className="space-y-2">
              <p className="font-normal text-blue-600">Category: {product.category}</p>
              <p className="font-normal text-red-600 text-xl">Price: ${product.price}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
