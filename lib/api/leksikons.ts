const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface Leksikon {
  leksikonId: number
  kataLeksikon: string
  ipa: string
  transliterasi: string
  maknaEtimologi: string
  maknaKultural: string
  commonMeaning: string
  translation: string
  varian?: string
  translationVarians?: string
  deskripsiLain?: string
  domainKodifikasiId: number
  statusPreservasi: "MAINTAINED" | "ENDANGERED" | "CRITICAL"
  contributorId: number
  status: "PUBLISHED" | "DRAFT"
  createdAt: string
  updatedAt: string
}

export interface LeksikonCreateInput {
  kataLeksikon: string
  ipa: string
  transliterasi: string
  maknaEtimologi: string
  maknaKultural: string
  commonMeaning: string
  translation: string
  varian?: string
  translationVarians?: string
  deskripsiLain?: string
  domainKodifikasiId: number
  statusPreservasi: "MAINTAINED" | "ENDANGERED" | "CRITICAL"
  contributorId: number
  status: "PUBLISHED" | "DRAFT"
}

export interface LeksikonResponse {
  success: boolean
  message: string
  data: Leksikon
}

export interface LeksikonsListResponse {
  success: boolean
  message: string
  data: Leksikon[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const MOCK_LEKSIKONS: Leksikon[] = [
  {
    leksikonId: 1,
    kataLeksikon: "Batik",
    ipa: "[ba.tɪk]",
    transliterasi: "batik",
    maknaEtimologi: "Dari bahasa Jawa kuno",
    maknaKultural: "Seni tradisional Indonesia",
    commonMeaning: "Traditional textile art",
    translation: "Batik",
    domainKodifikasiId: 1,
    statusPreservasi: "MAINTAINED",
    contributorId: 1,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

class LeksikonsService {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getAll(page = 1, limit = 10): Promise<LeksikonsListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/leksikons?page=${page}&limit=${limit}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch leksikons:", error)
      const start = (page - 1) * limit
      const end = start + limit
      return {
        success: true,
        message: "Using mock data (API unavailable)",
        data: MOCK_LEKSIKONS.slice(start, end),
        total: MOCK_LEKSIKONS.length,
        page,
        limit,
        totalPages: Math.ceil(MOCK_LEKSIKONS.length / limit),
      }
    }
  }

  async getById(id: number): Promise<LeksikonResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/leksikons/${id}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch leksikon:", error)
      const mockItem = MOCK_LEKSIKONS.find((l) => l.leksikonId === id)
      if (mockItem) {
        return { success: true, message: "Using mock data", data: mockItem }
      }
      throw new Error("Failed to fetch leksikon")
    }
  }

  async create(data: LeksikonCreateInput): Promise<LeksikonResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/leksikons`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to create leksikon:", error)
      throw new Error("Failed to create leksikon")
    }
  }

  async update(id: number, data: Partial<LeksikonCreateInput>): Promise<LeksikonResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/leksikons/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to update leksikon:", error)
      throw new Error("Failed to update leksikon")
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/leksikons/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to delete leksikon:", error)
      throw new Error("Failed to delete leksikon")
    }
  }
}

export const leksikonsService = new LeksikonsService()
