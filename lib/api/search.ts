const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface SearchResult {
  id: string
  type: "lexicon" | "reference" | "asset" | "contributor" | "codification"
  title: string
  description?: string
  category?: string
  url?: string
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
}

class SearchService {
  private getAuthHeaders() {
    if (typeof window === "undefined") return {}
    const token = localStorage.getItem("adminToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async search(query: string, type?: string): Promise<SearchResult[]> {
    if (!query.trim()) return []

    try {
      const params = new URLSearchParams({ q: query })
      if (type) params.append("type", type)

      const response = await fetch(`${API_BASE_URL}/search?${params}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        console.warn(`Search API Error: ${response.status}`)
        return this.getMockResults(query)
      }

      const data: SearchResponse = await response.json()
      return data.results
    } catch (error) {
      console.warn("[v0] Search API failed, using mock data:", error)
      return this.getMockResults(query)
    }
  }

  private getMockResults(query: string): SearchResult[] {
    const allResults: SearchResult[] = [
      // Lexicons
      {
        id: "lex-1",
        type: "lexicon",
        title: "Wayang",
        description: "Traditional puppet theater",
        category: "Seni Pertunjukan",
        url: "/admin/lexicons/lex-1",
      },
      {
        id: "lex-2",
        type: "lexicon",
        title: "Batik",
        description: "Traditional wax-resist dyeing technique",
        category: "Kerajinan",
        url: "/admin/lexicons/lex-2",
      },
      {
        id: "lex-3",
        type: "lexicon",
        title: "Gamelan",
        description: "Traditional musical ensemble",
        category: "Musik",
        url: "/admin/lexicons/lex-3",
      },
      // References
      {
        id: "ref-1",
        type: "reference",
        title: "Sejarah Budaya Jawa",
        description: "Comprehensive history of Javanese culture",
        category: "Jurnal",
        url: "/admin/references/ref-1",
      },
      {
        id: "ref-2",
        type: "reference",
        title: "Tradisi Tengger",
        description: "Study of Tengger traditions",
        category: "Buku",
        url: "/admin/references/ref-2",
      },
      // Assets
      {
        id: "asset-1",
        type: "asset",
        title: "Wayang Kulit Performance",
        description: "Video of traditional wayang performance",
        category: "VIDEO",
        url: "/admin/assets/asset-1",
      },
      {
        id: "asset-2",
        type: "asset",
        title: "Batik Pattern Collection",
        description: "High-resolution images of batik patterns",
        category: "FOTO",
        url: "/admin/assets/asset-2",
      },
      // Contributors
      {
        id: "contrib-1",
        type: "contributor",
        title: "Dr. Budi Santoso",
        description: "Cultural anthropologist from Universitas Gadjah Mada",
        category: "Akademisi",
        url: "/admin/contributors/contrib-1",
      },
      // Codification
      {
        id: "cod-1",
        type: "codification",
        title: "Agama dan Kepercayaan",
        description: "Religious and belief systems classification",
        category: "AK",
        url: "/admin/codification/cod-1",
      },
    ]

    const lowerQuery = query.toLowerCase()
    return allResults.filter(
      (result) =>
        result.title.toLowerCase().includes(lowerQuery) ||
        result.description?.toLowerCase().includes(lowerQuery) ||
        result.category?.toLowerCase().includes(lowerQuery),
    )
  }
}

export const searchService = new SearchService()
