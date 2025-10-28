const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface Culture {
  cultureId: number
  namaBudaya: string
  pulauAsal: string
  provinsi: string
  kotaDaerah: string
  klasifikasi: string
  karakteristik: string
  statusKonservasi: "MAINTAINED" | "ENDANGERED" | "CRITICAL"
  latitude: number
  longitude: number
  status: "PUBLISHED" | "DRAFT"
  createdAt: string
  updatedAt: string
}

export interface CultureCreateInput {
  namaBudaya: string
  pulauAsal: string
  provinsi: string
  kotaDaerah: string
  klasifikasi: string
  karakteristik: string
  statusKonservasi: "MAINTAINED" | "ENDANGERED" | "CRITICAL"
  latitude: number
  longitude: number
  status: "PUBLISHED" | "DRAFT"
}

export interface CultureResponse {
  success: boolean
  message: string
  data: Culture
}

export interface CulturesListResponse {
  success: boolean
  message: string
  data: Culture[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const MOCK_CULTURES: Culture[] = [
  {
    cultureId: 1,
    namaBudaya: "Batik Jawa Timur",
    pulauAsal: "Jawa",
    provinsi: "Jawa Timur",
    kotaDaerah: "Surabaya",
    klasifikasi: "Seni Tradisional",
    karakteristik: "Batik dengan motif khas Jawa Timur yang mencerminkan kekayaan budaya lokal",
    statusKonservasi: "MAINTAINED",
    latitude: -7.2575,
    longitude: 112.7521,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    cultureId: 2,
    namaBudaya: "Wayang Kulit",
    pulauAsal: "Jawa",
    provinsi: "Jawa Timur",
    kotaDaerah: "Malang",
    klasifikasi: "Pertunjukan Tradisional",
    karakteristik: "Seni pertunjukan bayangan dengan boneka kulit yang diterangi lampu",
    statusKonservasi: "ENDANGERED",
    latitude: -7.9797,
    longitude: 112.6304,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

class CulturesService {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getAll(page = 1, limit = 10): Promise<CulturesListResponse> {
    try {
      console.log("[v0] Fetching cultures from:", `${API_BASE_URL}/cultures?page=${page}&limit=${limit}`)

      const response = await fetch(`${API_BASE_URL}/cultures?page=${page}&limit=${limit}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch from API, using mock data:", error)
      console.log("[v0] Make sure NEXT_PUBLIC_API_URL is set correctly in environment variables")

      // Return mock data as fallback
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedData = MOCK_CULTURES.slice(start, end)

      return {
        success: true,
        message: "Using mock data (API unavailable)",
        data: paginatedData,
        total: MOCK_CULTURES.length,
        page,
        limit,
        totalPages: Math.ceil(MOCK_CULTURES.length / limit),
      }
    }
  }

  async getById(id: number): Promise<CultureResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cultures/${id}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch culture by ID, using mock data:", error)
      const mockItem = MOCK_CULTURES.find((c) => c.cultureId === id)

      if (mockItem) {
        return {
          success: true,
          message: "Using mock data (API unavailable)",
          data: mockItem,
        }
      }

      throw new Error("Failed to fetch culture")
    }
  }

  async create(data: CultureCreateInput): Promise<CultureResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cultures`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("[v0] Failed to create culture:", error)
      throw new Error("Failed to create culture. Please check your API connection.")
    }
  }

  async update(id: number, data: Partial<CultureCreateInput>): Promise<CultureResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cultures/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("[v0] Failed to update culture:", error)
      throw new Error("Failed to update culture. Please check your API connection.")
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/cultures/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("[v0] Failed to delete culture:", error)
      throw new Error("Failed to delete culture. Please check your API connection.")
    }
  }
}

export const culturesService = new CulturesService()
