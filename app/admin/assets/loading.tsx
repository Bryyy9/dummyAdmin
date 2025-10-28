import { Loader2 } from "lucide-react"

export default function AssetsLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Memuat data aset...</p>
      </div>
    </div>
  )
}
