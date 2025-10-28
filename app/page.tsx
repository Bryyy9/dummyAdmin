import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white">Budaya Jawa Timur</h1>
          <p className="text-xl text-slate-300">Admin Panel</p>
        </div>

        <p className="text-slate-400 text-lg">
          Kelola dan jaga warisan budaya Jawa Timur dengan mudah melalui panel administrasi kami.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/admin">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Masuk ke Admin Panel
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
            >
              Login
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-700">
          <p className="text-slate-500 text-sm">Demo Credentials: admin@budaya.com / admin123</p>
        </div>
      </div>
    </main>
  )
}
