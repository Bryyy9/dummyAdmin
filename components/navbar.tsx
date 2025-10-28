"use client"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logout berhasil")
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("Logout gagal")
    }
  }

  return (
    <nav className="bg-white border-b-4 border-red-200 drop-shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-blue-500 text-xl font-semibold">
                MyStoree
                <span className="text-black font-bold">App.</span>
              </h1>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-500 hover:text-blue-500 rounded-md px-2 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 rounded-md px-2 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link href="/" className="text-gray-500 hover:text-blue-500 rounded-md px-2 py-2 text-sm font-medium block">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 rounded-md px-2 py-2 text-sm font-medium w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
