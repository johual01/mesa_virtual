const API_BASE_URL = process.env.NEXT_PUBLIC_URL_API || '/api';

class ApiService {
  private getAuthHeaders(isFormData: boolean = false): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    
    // No incluir Content-Type para FormData, el browser lo establece automáticamente
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
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
    options: RequestInit = {},
    isFormData: boolean = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(isFormData),
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    const defaultMessage = `HTTP error status: ${response.status}`;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const errorData = await response.json().catch(() => null) as
        | { errMsg?: string; message?: string; error?: string }
        | null;

      if (errorData?.errMsg) return errorData.errMsg;
      if (errorData?.message) return errorData.message;
      if (typeof errorData?.error === 'string' && errorData.error.trim()) return errorData.error;
      return defaultMessage;
    }

    const text = await response.text().catch(() => '');
    if (text.trim()) return text;

    return defaultMessage;
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

  // PATCH request with FormData (for file uploads)
  async patchFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const userId = this.getUserId();
    if (userId) {
      formData.append('userId', userId);
    }
    
    console.log('PATCH FormData Request:', { endpoint, userId }); // Debug log
    
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: formData,
    }, true);
  }

  // POST request with FormData (for file uploads)
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const userId = this.getUserId();
    if (userId) {
      formData.append('userId', userId);
    }
    
    console.log('POST FormData Request:', { endpoint, userId }); // Debug log
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    }, true);
  }

  // PUT request with FormData (for file uploads)
  async putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const userId = this.getUserId();
    if (userId) {
      formData.append('userId', userId);
    }
    
    console.log('PUT FormData Request:', { endpoint, userId }); // Debug log
    
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: formData,
    }, true);
  }

  // DELETE request
  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    const userId = this.getUserId();
    const bodyData = userId ? (data ? { ...data, userId } : { userId }) : data;
    
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: bodyData ? JSON.stringify(bodyData) : undefined,
    });
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
