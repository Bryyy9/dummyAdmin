"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, FileText, ImageIcon, Code2, BookMarked } from "lucide-react"
import Link from "next/link"

const dashboardStats = [
  { label: "Lexicon Entries", value: "342", icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
  { label: "Subcultures", value: "8", icon: BookMarked, color: "bg-purple-500/10 text-purple-600" },
  { label: "Contributors", value: "24", icon: Users, color: "bg-green-500/10 text-green-600" },
  { label: "References", value: "156", icon: FileText, color: "bg-orange-500/10 text-orange-600" },
  { label: "Assets", value: "89", icon: ImageIcon, color: "bg-yellow-500/10 text-yellow-600" },
  { label: "Codification", value: "45", icon: Code2, color: "bg-red-500/10 text-red-600" },
]

const contentDistributionData = [
  { type: "Lexicon", count: 342 },
  { type: "Subculture", count: 8 },
  { type: "References", count: 156 },
  { type: "Assets", count: 89 },
  { type: "Codification", count: 45 },
]

const trendData = [
  { month: "Jan", lexicon: 280, references: 120 },
  { month: "Feb", lexicon: 295, references: 135 },
  { month: "Mar", lexicon: 310, references: 145 },
  { month: "Apr", lexicon: 325, references: 152 },
  { month: "May", lexicon: 335, references: 156 },
  { month: "Jun", lexicon: 342, references: 156 },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Budaya Jawa Timur - Content Management Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Content Growth Trend */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Content Growth Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
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
              <Line type="monotone" dataKey="lexicon" stroke="#3b82f6" strokeWidth={2} name="Lexicon Entries" />
              <Line type="monotone" dataKey="references" stroke="#8b5cf6" strokeWidth={2} name="References" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Content Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Content Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentDistributionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" />
              <YAxis dataKey="type" type="category" stroke="var(--muted-foreground)" width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/lexicon/create">
            <Button>Add New Lexicon Entry</Button>
          </Link>
          <Link href="/admin/subculture/create">
            <Button variant="outline">Create Subculture</Button>
          </Link>
          <Link href="/admin/contributors">
            <Button variant="outline">Manage Contributors</Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="outline">View Analytics</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
