const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface Contributor {
  contributorId: number
  namaContributor: string
  institusi: string
  email: string
  expertiseArea: string
  contactInfo: string
  registeredAt: string
}

export interface ContributorCreateInput {
  namaContributor: string
  institusi: string
  email: string
  expertiseArea: string
  contactInfo: string
}

export interface ContributorResponse {
  success: boolean
  message: string
  data: Contributor
}

export interface ContributorsListResponse {
  success: boolean
  message: string
  data: Contributor[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const MOCK_CONTRIBUTORS: Contributor[] = [
  {
    contributorId: 1,
    namaContributor: "Dr. Budi Santoso",
    institusi: "Universitas Airlangga",
    email: "budi@unair.ac.id",
    expertiseArea: "Budaya Jawa",
    contactInfo: "+62-31-1234567",
    registeredAt: new Date().toISOString(),
  },
]

class ContributorsService {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getAll(page = 1, limit = 10): Promise<ContributorsListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contributors?page=${page}&limit=${limit}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch contributors:", error)
      const start = (page - 1) * limit
      const end = start + limit
      return {
        success: true,
        message: "Using mock data (API unavailable)",
        data: MOCK_CONTRIBUTORS.slice(start, end),
        total: MOCK_CONTRIBUTORS.length,
        page,
        limit,
        totalPages: Math.ceil(MOCK_CONTRIBUTORS.length / limit),
      }
    }
  }

  async getById(id: number): Promise<ContributorResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contributors/${id}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch contributor:", error)
      const mockItem = MOCK_CONTRIBUTORS.find((c) => c.contributorId === id)
      if (mockItem) {
        return { success: true, message: "Using mock data", data: mockItem }
      }
      throw new Error("Failed to fetch contributor")
    }
  }

  async create(data: ContributorCreateInput): Promise<ContributorResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contributors`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to create contributor:", error)
      throw new Error("Failed to create contributor")
    }
  }

  async update(id: number, data: Partial<ContributorCreateInput>): Promise<ContributorResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contributors/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to update contributor:", error)
      throw new Error("Failed to update contributor")
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/contributors/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to delete contributor:", error)
      throw new Error("Failed to delete contributor")
    }
  }
}

export const contributorsService = new ContributorsService()
