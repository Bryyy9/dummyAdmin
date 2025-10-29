const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-corpora.vercel.app/api/v1';

export interface DomainKodifikasi {
  domainKodifikasiId: number;
  kode: string;
  namaDomain: string;
  penjelasan: string;
  subcultureId: number;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface DomainKodifikasiCreateInput {
  kode: string;
  namaDomain: string;
  penjelasan: string;
  subcultureId: number;
  status: 'PUBLISHED' | 'DRAFT';
}

export interface DomainKodifikasiResponse {
  data: DomainKodifikasi[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

export const domainKodifikasiService = {
  async getAll(page: number = 1, limit: number = 10): Promise<DomainKodifikasiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DomainKodifikasi[] = await response.json();
      
      // Backend tidak mengembalikan pagination, jadi kita handle di frontend
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = data.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: data.length,
        page,
        totalPages: Math.ceil(data.length / limit),
      };
    } catch (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<DomainKodifikasi> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching domain:', error);
      throw error;
    }
  },

  async create(data: DomainKodifikasiCreateInput): Promise<DomainKodifikasi> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating domain:', error);
      throw error;
    }
  },

  async update(id: number, data: DomainKodifikasiCreateInput): Promise<DomainKodifikasi> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating domain:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-kodifikasi/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting domain:', error);
      throw error;
    }
  },
};