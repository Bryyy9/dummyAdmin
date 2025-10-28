"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

interface LexiconAsset {
  leksikonId: number
  assetId: number
  assetRole: string
  kataLeksikon: string
}

export default function LexiconAssetsPage() {
  const [assets, setAssets] = useState<LexiconAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      // This would fetch all lexicon assets - adjust endpoint as needed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lexicons`)
      const data = await response.json()
      // Process data to extract assets
      setAssets([])
    } catch (error) {
      console.error("Error fetching assets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAsset = async (leksikonId: number, assetId: number) => {
    if (!confirm("Are you sure you want to remove this asset?")) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lexicons/${leksikonId}/assets/${assetId}`,
        { method: "DELETE" },
      )

      if (response.ok) {
        setAssets(assets.filter((a) => !(a.leksikonId === leksikonId && a.assetId === assetId)))
      }
    } catch (error) {
      console.error("Error removing asset:", error)
    }
  }

  const filteredAssets = assets.filter((asset) => asset.kataLeksikon.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lexicon Assets</h1>
          <p className="text-muted-foreground mt-2">Manage assets linked to lexicon entries</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets List</CardTitle>
          <CardDescription>View and manage lexicon assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search lexicon..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lexicon Word</TableHead>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Asset Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <TableRow key={`${asset.leksikonId}-${asset.assetId}`}>
                        <TableCell className="font-medium">{asset.kataLeksikon}</TableCell>
                        <TableCell>{asset.assetId}</TableCell>
                        <TableCell>{asset.assetRole}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAsset(asset.leksikonId, asset.assetId)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No assets found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
