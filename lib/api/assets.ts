const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface Asset {
  assetId: number
  namaFile: string
  tipe: "FOTO" | "AUDIO" | "VIDEO" | "MODEL_3D"
  penjelasan?: string
  url: string
  fileSize?: string
  hashChecksum?: string
  metadataJson?: string
  status: "ACTIVE" | "PROCESSING" | "ARCHIVED" | "CORRUPTED"
  createdAt: string
  updatedAt: string
}

export interface AssetCreateInput {
  namaFile: string
  tipe: "FOTO" | "AUDIO" | "VIDEO" | "MODEL_3D"
  penjelasan?: string
  url?: string
  fileSize?: string
  hashChecksum?: string
  metadataJson?: string
  status?: "ACTIVE" | "PROCESSING" | "ARCHIVED" | "CORRUPTED"
}

export interface AssetResponse {
  success: boolean
  message: string
  data: Asset
}

export interface AssetsListResponse {
  success: boolean
  message: string
  data: Asset[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const MOCK_ASSETS: Asset[] = [
  {
    assetId: 1,
    namaFile: "batik-sample.jpg",
    tipe: "FOTO",
    penjelasan: "Sampel batik Jawa Timur",
    url: "https://via.placeholder.com/300",
    fileSize: "250KB",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    assetId: 2,
    namaFile: "wayang-kulit-video.mp4",
    tipe: "VIDEO",
    penjelasan: "Video pertunjukan wayang kulit tradisional",
    url: "https://www.youtube.com/watch?v=example",
    fileSize: "150MB",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    assetId: 3,
    namaFile: "gamelan-recording.mp3",
    tipe: "AUDIO",
    penjelasan: "Rekaman musik gamelan Jawa Timur",
    url: "https://example.com/gamelan.mp3",
    fileSize: "8.5MB",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    assetId: 4,
    namaFile: "candi-borobudur-3d.glb",
    tipe: "MODEL_3D",
    penjelasan: "Model 3D Candi Borobudur",
    url: "https://sketchfab.com/models/example",
    fileSize: "45MB",
    status: "PROCESSING",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    assetId: 5,
    namaFile: "tari-reog-ponorogo.jpg",
    tipe: "FOTO",
    penjelasan: "Foto tari Reog Ponorogo",
    url: "https://via.placeholder.com/400",
    fileSize: "320KB",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
]

class AssetsService {
  private getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getAll(page = 1, limit = 10): Promise<AssetsListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/assets?page=${page}&limit=${limit}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch assets:", error)
      const start = (page - 1) * limit
      const end = start + limit
      return {
        success: true,
        message: "Using mock data (API unavailable)",
        data: MOCK_ASSETS.slice(start, end),
        total: MOCK_ASSETS.length,
        page,
        limit,
        totalPages: Math.ceil(MOCK_ASSETS.length / limit),
      }
    }
  }

  async getById(id: number): Promise<AssetResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to fetch asset:", error)
      const mockItem = MOCK_ASSETS.find((a) => a.assetId === id)
      if (mockItem) {
        return { success: true, message: "Using mock data", data: mockItem }
      }
      throw new Error("Failed to fetch asset")
    }
  }

  async create(data: AssetCreateInput, file?: File): Promise<AssetResponse> {
    try {
      const formData = new FormData()
      formData.append("namaFile", data.namaFile)
      formData.append("tipe", data.tipe)
      if (data.penjelasan) formData.append("penjelasan", data.penjelasan)
      if (data.url) formData.append("url", data.url)
      if (file) formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/assets/upload`, {
        method: "POST",
        headers: { Authorization: this.getAuthHeaders().Authorization || "" },
        body: formData,
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to create asset:", error)
      throw new Error("Failed to create asset")
    }
  }

  async update(id: number, data: Partial<AssetCreateInput>, file?: File): Promise<AssetResponse> {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
      if (file) formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: "PUT",
        headers: { Authorization: this.getAuthHeaders().Authorization || "" },
        body: formData,
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to update asset:", error)
      throw new Error("Failed to update asset")
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      return response.json()
    } catch (error) {
      console.error("[v0] Failed to delete asset:", error)
      throw new Error("Failed to delete asset")
    }
  }
}

export const assetsService = new AssetsService()
