const baseURL = 'http://localhost:3001';

interface ApiResponse<T> {
  data: T;
  headers: Headers;
}

const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, headers: response.headers };
  },

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, headers: response.headers };
  },

  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, headers: response.headers };
  },

  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};

export default apiClient; 