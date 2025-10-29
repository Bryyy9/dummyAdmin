"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Loader2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface Asset {
  assetId: number
  namaFile: string
  tipe: string
  penjelasan?: string
  url: string
  status: string
}

interface LexiconAsset {
  leksikonId: number
  assetId: number
  assetRole: string
  createdAt: string
  asset: Asset
  kataLeksikon?: string
}

interface Lexicon {
  leksikonId: number
  kataLeksikon: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-corpora.vercel.app/api/v1"

export default function LexiconAssetsPage() {
  const [assets, setAssets] = useState<LexiconAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setProgress({ current: 0, total: 0 })

      // Step 1: Fetch all lexicons
      const lexiconsResponse = await fetch(`${API_BASE_URL}/leksikons`, {
        headers: { "Content-Type": "application/json" },
      })

      if (!lexiconsResponse.ok) {
        throw new Error(`Failed to fetch lexicons: ${lexiconsResponse.status}`)
      }

      const lexiconsData = await lexiconsResponse.json()
      const lexicons: Lexicon[] = Array.isArray(lexiconsData) ? lexiconsData : lexiconsData.data || []

      console.log(`Found ${lexicons.length} lexicons`)
      setProgress({ current: 0, total: lexicons.length })

      // Step 2: Fetch assets for each lexicon
      const allAssets: LexiconAsset[] = []

      for (let i = 0; i < lexicons.length; i++) {
        const lexicon = lexicons[i]
        setProgress({ current: i + 1, total: lexicons.length })

        try {
          const assetsResponse = await fetch(`${API_BASE_URL}/leksikons/${lexicon.leksikonId}/assets`, {
            headers: { "Content-Type": "application/json" },
          })

          if (assetsResponse.ok) {
            const assetsData = await assetsResponse.json()
            const lexiconAssets: LexiconAsset[] = Array.isArray(assetsData) ? assetsData : assetsData.data || []

            // Add lexicon name to each asset
            lexiconAssets.forEach((asset) => {
              allAssets.push({
                ...asset,
                kataLeksikon: lexicon.kataLeksikon,
              })
            })

            console.log(`Lexicon ${lexicon.kataLeksikon}: ${lexiconAssets.length} assets`)
          }
        } catch (error) {
          console.error(`Error fetching assets for lexicon ${lexicon.leksikonId}:`, error)
          // Continue with next lexicon
        }
      }

      console.log(`Total assets found: ${allAssets.length}`)
      setAssets(allAssets)
    } catch (error) {
      console.error("Error fetching assets:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch lexicon assets")
    } finally {
      setLoading(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  const handleRemoveAsset = async (leksikonId: number, assetId: number) => {
    if (!confirm("Are you sure you want to remove this asset?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/leksikons/${leksikonId}/assets/${assetId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success("Asset removed successfully")
      setAssets(assets.filter((a) => !(a.leksikonId === leksikonId && a.assetId === assetId)))
    } catch (error) {
      console.error("Error removing asset:", error)
      toast.error(error instanceof Error ? error.message : "Failed to remove asset")
    }
  }

  const filteredAssets = assets.filter(
    (asset) =>
      asset.kataLeksikon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.asset?.namaFile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetRole?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAssetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      FOTO: "bg-blue-100 text-blue-800",
      VIDEO: "bg-purple-100 text-purple-800",
      AUDIO: "bg-green-100 text-green-800",
      MODEL_3D: "bg-orange-100 text-orange-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading lexicon assets...</p>
          {progress.total > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Processing {progress.current} of {progress.total} lexicons
              </p>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lexicon Assets</h1>
          <p className="text-muted-foreground mt-2">Manage assets linked to lexicon entries</p>
        </div>
        <Button onClick={fetchAssets} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {assets.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">No Assets Found</p>
            <p className="text-sm text-yellow-700 mt-1">
              There are no assets linked to any lexicon entries yet. Assets can be linked when creating or editing
              lexicon entries.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assets List</CardTitle>
          <CardDescription>View and manage lexicon assets ({assets.length} total)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search by lexicon word, asset name, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lexicon Word</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((item) => (
                    <TableRow key={`${item.leksikonId}-${item.assetId}`}>
                      <TableCell className="font-medium">{item.kataLeksikon || "-"}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.asset?.namaFile || "-"}</p>
                          {item.asset?.penjelasan && (
                            <p className="text-xs text-muted-foreground">{item.asset.penjelasan}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.asset?.tipe ? (
                          <Badge className={getAssetTypeColor(item.asset.tipe)} variant="outline">
                            {item.asset.tipe}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{item.assetRole}</TableCell>
                      <TableCell>
                        <Badge variant={item.asset?.status === "ACTIVE" ? "default" : "secondary"}>
                          {item.asset?.status || "UNKNOWN"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.asset?.url ? (
                          <a
                            href={item.asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                          >
                            View
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAsset(item.leksikonId, item.assetId)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No assets found matching your search" : "No assets linked to lexicon entries"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}