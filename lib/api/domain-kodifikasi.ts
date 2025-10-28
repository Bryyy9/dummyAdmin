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
    domainKodifikasiId: 4,
    kode: "AK",
    namaDomain: "Agama dan Kepercayaan Tengger",
    penjelasan: "Domain Agama dan Kepercayaan Tengger dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:58.817Z",
  },
  {
    domainKodifikasiId: 5,
    kode: "TT",
    namaDomain: "Tradisi Tengger",
    penjelasan: "Domain Tradisi Tengger dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:58.928Z",
  },
  {
    domainKodifikasiId: 6,
    kode: "DA",
    namaDomain: "Dukun dan Atributnya",
    penjelasan: "Domain Dukun dan Atributnya dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:59.036Z",
  },
  {
    domainKodifikasiId: 7,
    kode: "LF",
    namaDomain: "Legenda dan Falsafah",
    penjelasan: "Domain Legenda dan Falsafah dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:59.145Z",
  },
  {
    domainKodifikasiId: 8,
    kode: "KT",
    namaDomain: "Kalender Tengger",
    penjelasan: "Domain Kalender Tengger dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:59.253Z",
  },
  {
    domainKodifikasiId: 9,
    kode: "P",
    namaDomain: "Pernikahan",
    penjelasan: "Domain Pernikahan dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:59.362Z",
  },
  {
    domainKodifikasiId: 10,
    kode: "KK",
    namaDomain: "Kelahiran dan Kematian",
    penjelasan: "Domain Kelahiran dan Kematian dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:59.470Z",
  },
  {
    domainKodifikasiId: 11,
    kode: "TL",
    namaDomain: "Tenggerees dan Lingkungannya",
    penjelasan: "Domain Tenggerees dan Lingkungannya dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:59.578Z",
  },
  {
    domainKodifikasiId: 12,
    kode: "TT/S",
    namaDomain: "Tradisi Tengger - Sesajen",
    penjelasan: "Domain Tradisi Tengger - Sesajen dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:59.687Z",
  },
  {
    domainKodifikasiId: 13,
    kode: "TT/P",
    namaDomain: "Tradisi Tengger - Pertunjukan",
    penjelasan: "Domain Tradisi Tengger - Pertunjukan dalam budaya Tengger",
    subcultureId: 5,
    status: "PUBLISHED",
    createdAt: "2025-10-10T08:30:58.626Z",
    updatedAt: "2025-10-10T08:30:59.795Z",
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
