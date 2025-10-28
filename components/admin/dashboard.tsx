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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Map, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

const dashboardStats = [
  { label: "Total Cultural Items", value: "156", icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
  { label: "Regions", value: "12", icon: Map, color: "bg-purple-500/10 text-purple-600" },
  { label: "Total Views", value: "24.5K", icon: TrendingUp, color: "bg-green-500/10 text-green-600" },
  { label: "Active Users", value: "1.2K", icon: Users, color: "bg-orange-500/10 text-orange-600" },
]

const chartData = [
  { month: "Jan", views: 4000, items: 2400 },
  { month: "Feb", views: 3000, items: 1398 },
  { month: "Mar", views: 2000, items: 9800 },
  { month: "Apr", views: 2780, items: 3908 },
  { month: "May", views: 1890, items: 4800 },
  { month: "Jun", views: 2390, items: 3800 },
]

const categoryData = [
  { name: "Tari", value: 35 },
  { name: "Kuliner", value: 28 },
  { name: "Kerajinan", value: 22 },
  { name: "Musik", value: 15 },
]

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your cultural content overview.</p>
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
        {/* Line Chart */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Views & Items Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
              <Line type="monotone" dataKey="items" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Items by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/cultural-items">
            <Button>Add New Cultural Item</Button>
          </Link>
          <Link href="/admin/regions">
            <Button variant="outline">Manage Regions</Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="outline">View Full Analytics</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
