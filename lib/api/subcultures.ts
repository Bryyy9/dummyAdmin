const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface Subculture {
  subcultureId: number
  namaSubculture: string
  penjelasan: string
  cultureId: number
  status: "PUBLISHED" | "DRAFT"
  statusKonservasi: "MAINTAINED" | "ENDANGERED" | "CRITICAL"
  createdAt: string
  updatedAt: string
}

export interface SubcultureCreateInput {
  namaSubculture: string
  penjelasan: string
  cultureId: number
  status: "PUBLISHED" | "DRAFT"
  statusKonservasi: "MAINTAINED" | "ENDANGERED" | "CRITICAL"
}

export interface SubcultureResponse {
  success: boolean
  message: string
  data: Subculture
}

export interface SubculturesListResponse {
  success: boolean
  message: string
  data: Subculture[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const MOCK_SUBCULTURES: Subculture[] = [
  {
    subcultureId: 1,
    namaSubculture: "Batik Madura",
    penjelasan: "Batik tradisional dari Madura dengan motif unik",
    cultureId: 1,
    status: "PUBLISHED",
    statusKonservasi: "MAINTAINED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

class SubculturesService {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getAll(page = 1, limit = 10): Promise<SubculturesListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/subcultures?page=${page}&limit=${limit}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch subcultures:", error)
      const start = (page - 1) * limit
      const end = start + limit
      return {
        success: true,
        message: "Using mock data (API unavailable)",
        data: MOCK_SUBCULTURES.slice(start, end),
        total: MOCK_SUBCULTURES.length,
        page,
        limit,
        totalPages: Math.ceil(MOCK_SUBCULTURES.length / limit),
      }
    }
  }

  async getById(id: number): Promise<SubcultureResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/subcultures/${id}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch subculture:", error)
      const mockItem = MOCK_SUBCULTURES.find((s) => s.subcultureId === id)
      if (mockItem) {
        return { success: true, message: "Using mock data", data: mockItem }
      }
      throw new Error("Failed to fetch subculture")
    }
  }

  async create(data: SubcultureCreateInput): Promise<SubcultureResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/subcultures`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to create subculture:", error)
      throw new Error("Failed to create subculture")
    }
  }

  async update(id: number, data: Partial<SubcultureCreateInput>): Promise<SubcultureResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/subcultures/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to update subculture:", error)
      throw new Error("Failed to update subculture")
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/subcultures/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to delete subculture:", error)
      throw new Error("Failed to delete subculture")
    }
  }
}

export const subculturesService = new SubculturesService()
