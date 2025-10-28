const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface Reference {
  referensiId: number
  judul: string
  tipeReferensi: "JURNAL" | "BUKU" | "ARTIKEL" | "WEBSITE" | "LAPORAN"
  penjelasan?: string
  url?: string
  penulis?: string
  tahunTerbit?: string
  status: "PUBLISHED" | "DRAFT"
  createdAt: string
  updatedAt: string
}

export interface ReferenceCreateInput {
  judul: string
  tipeReferensi: "JURNAL" | "BUKU" | "ARTIKEL" | "WEBSITE" | "LAPORAN"
  penjelasan?: string
  url?: string
  penulis?: string
  tahunTerbit?: string
  status: "PUBLISHED" | "DRAFT"
}

export interface ReferenceResponse {
  success: boolean
  message: string
  data: Reference
}

export interface ReferencesListResponse {
  success: boolean
  message: string
  data: Reference[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const MOCK_REFERENCES: Reference[] = [
  {
    referensiId: 1,
    judul: "Budaya Jawa Timur: Sejarah dan Perkembangan",
    tipeReferensi: "BUKU",
    penjelasan: "Buku komprehensif tentang budaya Jawa Timur",
    penulis: "Prof. Soemanto",
    tahunTerbit: "2020",
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

class ReferencesService {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getAll(page = 1, limit = 10): Promise<ReferencesListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/referensi?page=${page}&limit=${limit}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch references:", error)
      const start = (page - 1) * limit
      const end = start + limit
      return {
        success: true,
        message: "Using mock data (API unavailable)",
        data: MOCK_REFERENCES.slice(start, end),
        total: MOCK_REFERENCES.length,
        page,
        limit,
        totalPages: Math.ceil(MOCK_REFERENCES.length / limit),
      }
    }
  }

  async getById(id: number): Promise<ReferenceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/referensi/${id}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch reference:", error)
      const mockItem = MOCK_REFERENCES.find((r) => r.referensiId === id)
      if (mockItem) {
        return { success: true, message: "Using mock data", data: mockItem }
      }
      throw new Error("Failed to fetch reference")
    }
  }

  async create(data: ReferenceCreateInput): Promise<ReferenceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/referensi`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to create reference:", error)
      throw new Error("Failed to create reference")
    }
  }

  async update(id: number, data: Partial<ReferenceCreateInput>): Promise<ReferenceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/referensi/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to update reference:", error)
      throw new Error("Failed to update reference")
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/referensi/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to delete reference:", error)
      throw new Error("Failed to delete reference")
    }
  }
}

export const referencesService = new ReferencesService()
