const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface DomainKodifikasi {
  domainKodifikasiId: number
  kode: string
  namaDomain: string
  penjelasan: string
  subcultureId: number
  status: "PUBLISHED" | "DRAFT"
  createdAt: string
  updatedAt: string
}

export interface DomainKodifikasiCreateInput {
  kode: string
  namaDomain: string
  penjelasan: string
  subcultureId: number
  status: "PUBLISHED" | "DRAFT"
}

export interface DomainKodifikasiResponse {
  success: boolean
  message: string
  data: DomainKodifikasi
}

export interface DomainKodifikasiListResponse {
  success: boolean
  message: string
  data: DomainKodifikasi[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const MOCK_DOMAINS: DomainKodifikasi[] = [
  {
    domainKodifikasiId: 1,
    kode: "DK001",
    namaDomain: "Seni Tradisional",
    penjelasan: "Domain untuk seni tradisional Jawa Timur",
    subcultureId: 1,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

class DomainKodifikasiService {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getAll(page = 1, limit = 10): Promise<DomainKodifikasiListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi?page=${page}&limit=${limit}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch domains:", error)
      const start = (page - 1) * limit
      const end = start + limit
      return {
        success: true,
        message: "Using mock data (API unavailable)",
        data: MOCK_DOMAINS.slice(start, end),
        total: MOCK_DOMAINS.length,
        page,
        limit,
        totalPages: Math.ceil(MOCK_DOMAINS.length / limit),
      }
    }
  }

  async getById(id: number): Promise<DomainKodifikasiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi/${id}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch domain:", error)
      const mockItem = MOCK_DOMAINS.find((d) => d.domainKodifikasiId === id)
      if (mockItem) {
        return { success: true, message: "Using mock data", data: mockItem }
      }
      throw new Error("Failed to fetch domain")
    }
  }

  async create(data: DomainKodifikasiCreateInput): Promise<DomainKodifikasiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to create domain:", error)
      throw new Error("Failed to create domain")
    }
  }

  async update(id: number, data: Partial<DomainKodifikasiCreateInput>): Promise<DomainKodifikasiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to update domain:", error)
      throw new Error("Failed to update domain")
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to delete domain:", error)
      throw new Error("Failed to delete domain")
    }
  }
}

export const domainKodifikasiService = new DomainKodifikasiService()
