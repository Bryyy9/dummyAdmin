// components/admin/dashboard.tsx
"use client"

import { useState, useEffect } from "react"
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
import { BookOpen, Users, FileText, ImageIcon, Code2, BookMarked, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-corpora.vercel.app/api/v1"

interface DashboardStats {
  lexiconCount: number
  subcultureCount: number
  contributorCount: number
  referenceCount: number
  assetCount: number
  domainCount: number
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    lexiconCount: 0,
    subcultureCount: 0,
    contributorCount: 0,
    referenceCount: 0,
    assetCount: 0,
    domainCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch semua data secara parallel
      const [
        lexikonsRes,
        subculturesRes,
        contributorsRes,
        referencesRes,
        assetsRes,
        domainsRes,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/leksikons`).then(r => r.json()),
        fetch(`${API_BASE_URL}/subcultures`).then(r => r.json()),
        fetch(`${API_BASE_URL}/contributors`).then(r => r.json()),
        fetch(`${API_BASE_URL}/referensi`).then(r => r.json()),
        fetch(`${API_BASE_URL}/assets`).then(r => r.json()),
        fetch(`${API_BASE_URL}/domain-kodifikasi`).then(r => r.json()),
      ])

      setStats({
        lexiconCount: Array.isArray(lexikonsRes) ? lexikonsRes.length : lexikonsRes.data?.length || 0,
        subcultureCount: Array.isArray(subculturesRes) ? subculturesRes.length : subculturesRes.data?.length || 0,
        contributorCount: Array.isArray(contributorsRes) ? contributorsRes.length : contributorsRes.data?.length || 0,
        referenceCount: Array.isArray(referencesRes) ? referencesRes.length : referencesRes.data?.length || 0,
        assetCount: Array.isArray(assetsRes) ? assetsRes.length : assetsRes.data?.length || 0,
        domainCount: Array.isArray(domainsRes) ? domainsRes.length : domainsRes.data?.length || 0,
      })
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Using default values.")
    } finally {
      setLoading(false)
    }
  }

  const dashboardStats = [
    { 
      label: "Lexicon Entries", 
      value: stats.lexiconCount.toString(), 
      icon: BookOpen, 
      color: "bg-blue-500/10 text-blue-600",
      href: "/admin/lexicon"
    },
    { 
      label: "Subcultures", 
      value: stats.subcultureCount.toString(), 
      icon: BookMarked, 
      color: "bg-purple-500/10 text-purple-600",
      href: "/admin/subculture"
    },
    { 
      label: "Contributors", 
      value: stats.contributorCount.toString(), 
      icon: Users, 
      color: "bg-green-500/10 text-green-600",
      href: "/admin/contributors"
    },
    { 
      label: "References", 
      value: stats.referenceCount.toString(), 
      icon: FileText, 
      color: "bg-orange-500/10 text-orange-600",
      href: "/admin/references"
    },
    { 
      label: "Assets", 
      value: stats.assetCount.toString(), 
      icon: ImageIcon, 
      color: "bg-yellow-500/10 text-yellow-600",
      href: "/admin/assets"
    },
    { 
      label: "Codification", 
      value: stats.domainCount.toString(), 
      icon: Code2, 
      color: "bg-red-500/10 text-red-600",
      href: "/admin/codification"
    },
  ]

  const contentDistributionData = [
    { type: "Lexicon", count: stats.lexiconCount },
    { type: "Subculture", count: stats.subcultureCount },
    { type: "References", count: stats.referenceCount },
    { type: "Assets", count: stats.assetCount },
    { type: "Codification", count: stats.domainCount },
  ]

  // Mock trend data (bisa diganti dengan data real dari backend)
  const trendData = [
    { month: "Jan", lexicon: Math.floor(stats.lexiconCount * 0.82), references: Math.floor(stats.referenceCount * 0.77) },
    { month: "Feb", lexicon: Math.floor(stats.lexiconCount * 0.86), references: Math.floor(stats.referenceCount * 0.87) },
    { month: "Mar", lexicon: Math.floor(stats.lexiconCount * 0.91), references: Math.floor(stats.referenceCount * 0.93) },
    { month: "Apr", lexicon: Math.floor(stats.lexiconCount * 0.95), references: Math.floor(stats.referenceCount * 0.97) },
    { month: "May", lexicon: Math.floor(stats.lexiconCount * 0.98), references: Math.floor(stats.referenceCount * 1.0) },
    { month: "Jun", lexicon: stats.lexiconCount, references: stats.referenceCount },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Budaya Jawa Timur - Content Management Overview</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Warning</p>
            <p className="text-sm text-yellow-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
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
            </Link>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Content Growth Trend */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Content Growth Trend (Estimated)</h2>
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