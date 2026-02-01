const API_BASE_URL = process.env.NEXT_PUBLIC_URL_API || 'http://localhost:3001';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getUserId(): string | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const userId = user._id || user.id || null;
        console.log('getUserId:', { user, userId }); // Debug log
        return userId;
      } catch {
        return null;
      }
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, includeUserId: boolean = false): Promise<T> {
    let finalEndpoint = endpoint;
    
    if (includeUserId) {
      const userId = this.getUserId();
      if (userId) {
        const separator = endpoint.includes('?') ? '&' : '?';
        finalEndpoint = `${endpoint}${separator}userId=${userId}`;
      }
    }
    
    return this.request<T>(finalEndpoint, { method: 'GET' });
  }

  // GET request with body (for endpoints that need userId in body)
  async getWithBody<T>(endpoint: string, data?: unknown): Promise<T> {
    const userId = this.getUserId();
    const bodyData = userId ? (data ? { ...data, userId } : { userId }) : data;
    
    console.log('GET with Body Request:', { endpoint, originalData: data, bodyData, userId }); // Debug log
    
    return this.request<T>(endpoint, {
      method: 'GET',
      body: bodyData ? JSON.stringify(bodyData) : undefined,
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const userId = this.getUserId();
    const bodyData = userId ? (data ? { ...data, userId } : { userId }) : data;
    
    console.log('POST Request:', { endpoint, originalData: data, bodyData, userId }); // Debug log
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: bodyData ? JSON.stringify(bodyData) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const userId = this.getUserId();
    const bodyData = userId ? (data ? { ...data, userId } : { userId }) : data;
    
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: bodyData ? JSON.stringify(bodyData) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const userId = this.getUserId();
    const bodyData = userId ? (data ? { ...data, userId } : { userId }) : data;
    
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: bodyData ? JSON.stringify(bodyData) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // DELETE request with body
  async deleteWithBody<T>(endpoint: string, data?: unknown): Promise<T> {
    const userId = this.getUserId();
    const bodyData = userId ? (data ? { ...data, userId } : { userId }) : data;
    
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: bodyData ? JSON.stringify(bodyData) : undefined,
    });
  }
}

export const apiService = new ApiService();
