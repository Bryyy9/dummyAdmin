// components/admin/analytics.tsx
"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-corpora.vercel.app/api/v1"

interface AnalyticsData {
  totalLexicons: number
  totalSubcultures: number
  totalContributors: number
  totalReferences: number
  totalAssets: number
  totalDomains: number
  publishedCount: number
  draftCount: number
  statusBreakdown: {
    published: number
    draft: number
  }
  conservationStatus: {
    maintained: number
    endangered: number
    critical: number
  }
  topContributors: Array<{
    name: string
    count: number
    institution: string
  }>
  assetTypeDistribution: Array<{
    type: string
    count: number
  }>
  referenceTypeDistribution: Array<{
    type: string
    count: number
  }>
  monthlyGrowth: Array<{
    month: string
    lexicons: number
    references: number
  }>
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data in parallel
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

      // Process data
      const lexikons = Array.isArray(lexikonsRes) ? lexikonsRes : lexikonsRes.data || []
      const subcultures = Array.isArray(subculturesRes) ? subculturesRes : subculturesRes.data || []
      const contributors = Array.isArray(contributorsRes) ? contributorsRes : contributorsRes.data || []
      const references = Array.isArray(referencesRes) ? referencesRes : referencesRes.data || []
      const assets = Array.isArray(assetsRes) ? assetsRes : assetsRes.data || []
      const domains = Array.isArray(domainsRes) ? domainsRes : domainsRes.data || []

      // Calculate status breakdown
      const publishedLexicons = lexikons.filter((l: any) => l.status === 'PUBLISHED').length
      const draftLexicons = lexikons.filter((l: any) => l.status === 'DRAFT').length

      // Calculate conservation status
      const maintained = lexikons.filter((l: any) => l.statusPreservasi === 'MAINTAINED').length
      const endangered = lexikons.filter((l: any) => l.statusPreservasi === 'ENDANGERED').length
      const critical = lexikons.filter((l: any) => l.statusPreservasi === 'CRITICAL').length

      // Calculate top contributors
      const contributorCounts = new Map<number, { name: string; count: number; institution: string }>()
      lexikons.forEach((lex: any) => {
        const contributor = contributors.find((c: any) => c.contributorId === lex.contributorId)
        if (contributor) {
          const existing = contributorCounts.get(lex.contributorId)
          if (existing) {
            existing.count++
          } else {
            contributorCounts.set(lex.contributorId, {
              name: contributor.namaContributor,
              count: 1,
              institution: contributor.institusi
            })
          }
        }
      })
      const topContributors = Array.from(contributorCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Asset type distribution
      const assetTypes = new Map<string, number>()
      assets.forEach((asset: any) => {
        assetTypes.set(asset.tipe, (assetTypes.get(asset.tipe) || 0) + 1)
      })
      const assetTypeDistribution = Array.from(assetTypes.entries()).map(([type, count]) => ({
        type,
        count
      }))

      // Reference type distribution
      const refTypes = new Map<string, number>()
      references.forEach((ref: any) => {
        refTypes.set(ref.tipeReferensi, (refTypes.get(ref.tipeReferensi) || 0) + 1)
      })
      const referenceTypeDistribution = Array.from(refTypes.entries()).map(([type, count]) => ({
        type,
        count
      }))

      // Generate monthly growth (mock based on current data)
      const monthlyGrowth = generateMonthlyGrowth(lexikons.length, references.length, timeRange)

      setData({
        totalLexicons: lexikons.length,
        totalSubcultures: subcultures.length,
        totalContributors: contributors.length,
        totalReferences: references.length,
        totalAssets: assets.length,
        totalDomains: domains.length,
        publishedCount: publishedLexicons,
        draftCount: draftLexicons,
        statusBreakdown: {
          published: publishedLexicons,
          draft: draftLexicons
        },
        conservationStatus: {
          maintained,
          endangered,
          critical
        },
        topContributors,
        assetTypeDistribution,
        referenceTypeDistribution,
        monthlyGrowth
      })
    } catch (err) {
      console.error("Error fetching analytics data:", err)
      setError("Failed to load analytics data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyGrowth = (totalLex: number, totalRef: number, range: string) => {
    const months = range === 'week' ? 7 : range === 'month' ? 30 : 365
    const labels = range === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : range === 'month'
      ? Array.from({length: 30}, (_, i) => `Day ${i + 1}`)
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return labels.map((label, index) => ({
      month: label,
      lexicons: Math.floor(totalLex * (0.7 + (index / labels.length) * 0.3)),
      references: Math.floor(totalRef * (0.6 + (index / labels.length) * 0.4))
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error Loading Analytics</p>
            <p className="text-sm text-red-700 mt-1">{error || "Unknown error occurred"}</p>
            <Button onClick={fetchAnalyticsData} variant="outline" size="sm" className="mt-3">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const growthPercentage = data.totalLexicons > 0 
    ? ((data.publishedCount / data.totalLexicons) * 100).toFixed(1)
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track performance and content insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Content</p>
              <p className="text-3xl font-bold mt-2">{data.totalLexicons}</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">{growthPercentage}% published</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Contributors</p>
              <p className="text-3xl font-bold mt-2">{data.totalContributors}</p>
              <p className="text-sm text-muted-foreground mt-2">Active contributors</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">References</p>
              <p className="text-3xl font-bold mt-2">{data.totalReferences}</p>
              <p className="text-sm text-muted-foreground mt-2">Total citations</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Assets</p>
              <p className="text-3xl font-bold mt-2">{data.totalAssets}</p>
              <p className="text-sm text-muted-foreground mt-2">Media files</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Content Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Published</span>
                <Badge className="bg-green-100 text-green-800">{data.statusBreakdown.published}</Badge>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(data.statusBreakdown.published / data.totalLexicons) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Draft</span>
                <Badge className="bg-yellow-100 text-yellow-800">{data.statusBreakdown.draft}</Badge>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${(data.statusBreakdown.draft / data.totalLexicons) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Conservation Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Maintained</span>
                <Badge className="bg-green-100 text-green-800">{data.conservationStatus.maintained}</Badge>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(data.conservationStatus.maintained / data.totalLexicons) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Endangered</span>
                <Badge className="bg-yellow-100 text-yellow-800">{data.conservationStatus.endangered}</Badge>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${(data.conservationStatus.endangered / data.totalLexicons) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Critical</span>
                <Badge className="bg-red-100 text-red-800">{data.conservationStatus.critical}</Badge>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${(data.conservationStatus.critical / data.totalLexicons) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subcultures</span>
              <span className="font-semibold">{data.totalSubcultures}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Domains</span>
              <span className="font-semibold">{data.totalDomains}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. per Contributor</span>
              <span className="font-semibold">
                {data.totalContributors > 0 ? Math.floor(data.totalLexicons / data.totalContributors) : 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Content Growth Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="lexicons" stroke="#3b82f6" strokeWidth={2} name="Lexicons" />
            <Line type="monotone" dataKey="references" stroke="#8b5cf6" strokeWidth={2} name="References" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Type Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Asset Type Distribution</h2>
          {data.assetTypeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.assetTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }: any) => `${type} (${(Number(percent || 0) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.assetTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No asset data available
            </div>
          )}
        </Card>

        {/* Reference Type Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Reference Type Distribution</h2>
          {data.referenceTypeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.referenceTypeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="type" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No reference data available
            </div>
          )}
        </Card>
      </div>

      {/* Top Contributors */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Top Contributors</h2>
        <div className="space-y-4">
          {data.topContributors.length > 0 ? (
            data.topContributors.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{contributor.name}</p>
                      <p className="text-sm text-muted-foreground">{contributor.institution}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{contributor.count} entries</Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No contributor data available
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}