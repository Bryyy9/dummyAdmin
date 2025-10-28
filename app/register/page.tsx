"use client"

import type React from "react"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast.success("Registrasi berhasil! Silakan login.")
      router.push("/login")
    } catch (error: any) {
      console.error("Register error:", error)
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email sudah terdaftar!")
      } else if (error.code === "auth/weak-password") {
        toast.error("Password terlalu lemah!")
      } else {
        toast.error("Registrasi gagal!")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-center min-h-screen items-center bg-sky-200">
      <section className="flex flex-col space-y-4 w-full max-w-md bg-white border-2 text-violet-600 rounded-xl p-6">
        <h1 className="text-center text-2xl font-bold">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password">Create Password</Label>
            <div className="flex flex-row items-center w-full relative">
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                title={!showPass ? "Show Password" : "Hide password"}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="py-2 px-4 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login di sini
          </Link>
        </p>
      </section>
    </div>
  )
}
