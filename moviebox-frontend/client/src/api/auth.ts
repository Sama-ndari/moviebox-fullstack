import { apiClient } from '@/lib/apiClient';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  bio?: string;
  followers: string[];
  following: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authAPI = {
  async register(data: RegisterData) {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Store tokens
    if (response.statusCode === 201 && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens
    if (response.statusCode === 200 && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  async logout() {
    const response = await apiClient.post('/auth/logout');
    
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return response;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  async forgotPassword(email: string) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string) {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },
};
