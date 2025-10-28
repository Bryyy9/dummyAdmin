"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const viewsData = [
  { date: "Mon", views: 1200, unique: 800 },
  { date: "Tue", views: 1900, unique: 1200 },
  { date: "Wed", views: 1600, unique: 1000 },
  { date: "Thu", views: 2100, unique: 1400 },
  { date: "Fri", views: 2400, unique: 1600 },
  { date: "Sat", views: 2200, unique: 1500 },
  { date: "Sun", views: 1800, unique: 1200 },
]

const topItems = [
  { title: "Tari Reog Ponorogo", views: 4500, engagement: 92 },
  { title: "Rawon", views: 3800, engagement: 88 },
  { title: "Batik Malangan", views: 3200, engagement: 85 },
  { title: "Wayang Kulit", views: 2900, engagement: 82 },
  { title: "Rujak Cingur", views: 2600, engagement: 80 },
]

export function Analytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track performance and user engagement</p>
      </div>

      {/* Views Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Views</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="unique" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Items */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Top Cultural Items</h2>
        <div className="space-y-4">
          {topItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.views.toLocaleString()} views</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary">{item.engagement}% engagement</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
