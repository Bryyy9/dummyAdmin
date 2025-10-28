"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface SubcultureAsset {
  subcultureId: number
  assetId: number
  assetRole: string
  asset: {
    assetId: number
    namaFile: string
    tipe: string
    penjelasan: string
    url: string
  }
}

export default function SubcultureAssetsPage() {
  const [assets, setAssets] = useState<SubcultureAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Fetch all subcultures first to get their assets
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subcultures`)
        if (!response.ok) throw new Error("Failed to fetch subcultures")
        const data = await response.json()

        // Collect all assets from all subcultures
        const allAssets: SubcultureAsset[] = []
        for (const subculture of data.data || []) {
          if (subculture.subcultureAssets) {
            allAssets.push(...subculture.subcultureAssets)
          }
        }
        setAssets(allAssets)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const handleRemoveAsset = async (subcultureId: number, assetId: number) => {
    if (!confirm("Are you sure you want to remove this asset?")) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/subcultures/${subcultureId}/assets/${assetId}`,
        { method: "DELETE" },
      )
      if (!response.ok) throw new Error("Failed to remove asset")
      setAssets(assets.filter((a) => !(a.subcultureId === subcultureId && a.assetId === assetId)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove asset")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subculture Assets</h1>
          <p className="text-muted-foreground mt-2">Manage assets linked to subcultures</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Link Asset
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Loading assets...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assets.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">No assets linked to subcultures</p>
              </CardContent>
            </Card>
          ) : (
            assets.map((asset, idx) => (
              <Card key={`${asset.subcultureId}-${asset.assetId}-${idx}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle>{asset.asset.namaFile}</CardTitle>
                      <CardDescription className="mt-2">{asset.asset.penjelasan}</CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleRemoveAsset(asset.subcultureId, asset.assetId)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{asset.asset.tipe}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Role</p>
                      <p className="font-medium">{asset.assetRole}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">URL</p>
                      <a
                        href={asset.asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
