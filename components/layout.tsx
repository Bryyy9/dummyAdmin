import type React from "react"
import Navbar from "./navbar"
import Footer from "./footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-full py-8">{children}</main>
      <Footer />
    </div>
  )
}
