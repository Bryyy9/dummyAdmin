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
    registeredAt: new Date(2024, 0, 15).toISOString(),
  },
  {
    contributorId: 2,
    namaContributor: "Prof. Siti Nurhaliza",
    institusi: "Universitas Indonesia",
    email: "siti@ui.ac.id",
    expertiseArea: "Budaya Indonesia",
    contactInfo: "+62-21-7654321",
    registeredAt: new Date(2024, 1, 20).toISOString(),
  },
  {
    contributorId: 3,
    namaContributor: "Dr. Ahmad Wijaya",
    institusi: "Institut Teknologi Bandung",
    email: "ahmad@itb.ac.id",
    expertiseArea: "Budaya Jawa",
    contactInfo: "+62-274-1234567",
    registeredAt: new Date(2024, 2, 10).toISOString(),
  },
  {
    contributorId: 4,
    namaContributor: "Dr. Rina Kusuma",
    institusi: "Universitas Gadjah Mada",
    email: "rina@ugm.ac.id",
    expertiseArea: "Budaya Indonesia",
    contactInfo: "+62-274-9876543",
    registeredAt: new Date(2024, 3, 5).toISOString(),
  },
  {
    contributorId: 5,
    namaContributor: "Prof. Hendra Gunawan",
    institusi: "Universitas Padjadjaran",
    email: "hendra@unpad.ac.id",
    expertiseArea: "Budaya Jawa",
    contactInfo: "+62-22-5555555",
    registeredAt: new Date(2024, 4, 12).toISOString(),
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
      const url = `${API_BASE_URL}/contributors?page=${page}&limit=${limit}`
      console.log("[v0] Fetching contributors from:", url)

      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Successfully fetched contributors from API")
      return data
    } catch (error) {
      console.error("[v0] Failed to fetch contributors from API:", error)
      console.log("[v0] Using mock data as fallback. Make sure NEXT_PUBLIC_API_URL is set correctly.")

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
