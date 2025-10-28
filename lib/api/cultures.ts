const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Culture {
  cultureId: number;
  namaBudaya: string;
  pulauAsal: string;
  provinsi: string;
  kotaDaerah: string;
  klasifikasi: string;
  karakteristik: string;
  statusKonservasi: 'MAINTAINED' | 'ENDANGERED' | 'CRITICAL';
  latitude: number;
  longitude: number;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface CultureCreateInput {
  namaBudaya: string;
  pulauAsal: string;
  provinsi: string;
  kotaDaerah: string;
  klasifikasi: string;
  karakteristik: string;
  statusKonservasi: 'MAINTAINED' | 'ENDANGERED' | 'CRITICAL';
  latitude: number;
  longitude: number;
  status: 'PUBLISHED' | 'DRAFT';
}

export interface CultureResponse {
  success: boolean;
  message: string;
  data: Culture;
}

export interface CulturesListResponse {
  success: boolean;
  message: string;
  data: Culture[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CulturesService {
  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAll(page: number = 1, limit: number = 10): Promise<CulturesListResponse> {
    const response = await fetch(`${API_BASE_URL}/cultures?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cultures');
    }
    
    return response.json();
  }

  async getById(id: number): Promise<CultureResponse> {
    const response = await fetch(`${API_BASE_URL}/cultures/${id}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch culture');
    }
    
    return response.json();
  }

  async create(data: CultureCreateInput): Promise<CultureResponse> {
    const response = await fetch(`${API_BASE_URL}/cultures`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create culture');
    }
    
    return response.json();
  }

  async update(id: number, data: Partial<CultureCreateInput>): Promise<CultureResponse> {
    const response = await fetch(`${API_BASE_URL}/cultures/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update culture');
    }
    
    return response.json();
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/cultures/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete culture');
    }
    
    return response.json();
  }
}

export const culturesService = new CulturesService();