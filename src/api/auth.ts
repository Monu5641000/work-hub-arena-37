
import axios from 'axios';
import { ApiResponse, User } from '@/types/api';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  async register(userData: any): Promise<ApiResponse<User>> {
    const response = await api.post('/auth/register', userData);
    const data = response.data as ApiResponse<User>;
    if (data.success) {
      localStorage.setItem('token', data.token!);
      localStorage.setItem('user', JSON.stringify(data.user!));
    }
    return data;
  },

  async login(credentials: any): Promise<ApiResponse<User>> {
    const response = await api.post('/auth/login', credentials);
    const data = response.data as ApiResponse<User>;
    if (data.success) {
      localStorage.setItem('token', data.token!);
      localStorage.setItem('user', JSON.stringify(data.user!));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await api.get('/auth/me');
    return response.data as ApiResponse<User>;
  },

  async updateProfile(profileData: any): Promise<ApiResponse<User>> {
    const response = await api.put('/users/profile', profileData);
    const data = response.data as ApiResponse<User>;
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.data!));
    }
    return data;
  },

  async changePassword(passwordData: any): Promise<ApiResponse> {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data as ApiResponse;
  },

  async updateRequirements(requirements: any): Promise<ApiResponse<User>> {
    const response = await api.put('/auth/requirements', { requirements });
    const data = response.data as ApiResponse<User>;
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user!));
    }
    return data;
  }
};
