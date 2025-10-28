"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import ModalEdit from "./modal-edit"
import ModalDelete from "./modal-delete"
import ModalViewDetail from "./modal-view-detail"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  title: string
  price: number
  image: string
  category: string
  description: string
}

export default function ProductsTable() {
  const [listProduct, setListProduct] = useState<Product[]>([])
  const [authUser, setAuthUser] = useState<any>(null)
  const router = useRouter()

  const getProductList = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products")
      setListProduct(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user)
        getProductList()
      } else {
        setAuthUser(null)
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="bg-white py-4 px-3 my-4 rounded-xl flex bg-red-200">
          <h4 className="font-medium text-black">
            Welcome back&nbsp;
            {authUser ? (
              <span className="font-bold text-sky-600">{authUser.email}!</span>
            ) : (
              <span className="text-gray-500">Loading...</span>
            )}
          </h4>
        </div>

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {listProduct.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                        />
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-nowrap">{product.title}</p>
                          <p className="text-gray-600 whitespace-nowrap">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-nowrap">${product.price}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right space-x-2 flex justify-end">
                      <Link href={`/products/${product.id}`}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                          View Detail
                        </button>
                      </Link>
                      <ModalEdit id={product.id} />
                      <ModalViewDetail id={product.id} />
                      <ModalDelete id={product.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
