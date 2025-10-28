"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2 } from "lucide-react"

const mockRegions = [
  {
    id: "arekan",
    name: "Arekan",
    color: "#8CF000",
    population: "~5.1M",
    highlights: 3,
    status: "active",
  },
  {
    id: "madura",
    name: "Madura",
    color: "#FF0DEF",
    population: "~4.2M",
    highlights: 3,
    status: "active",
  },
  {
    id: "mataraman",
    name: "Mataraman",
    color: "#FAFA10",
    population: "~3.6M",
    highlights: 3,
    status: "active",
  },
  {
    id: "osing",
    name: "Osing",
    color: "#2380D7",
    population: "~1.1M",
    highlights: 3,
    status: "active",
  },
]

export function RegionsManagement() {
  const [regions, setRegions] = useState(mockRegions)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Regions</h1>
          <p className="text-muted-foreground mt-1">Manage cultural regions and sub-regions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Region
        </Button>
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => (
          <Card key={region.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: region.color }} />
                <div>
                  <h3 className="font-semibold text-foreground">{region.name}</h3>
                  <p className="text-sm text-muted-foreground">{region.population}</p>
                </div>
              </div>
              <Badge variant={region.status === "active" ? "default" : "secondary"}>{region.status}</Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Highlights</p>
                <p className="text-sm font-medium">{region.highlights} items</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
