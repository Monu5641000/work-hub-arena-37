
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
  // Login with email/password
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Register with email/password
  register: async (userData: any): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Get current user
  getMe: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      console.error('Get me error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user info'
      };
    }
  },

  // Select role
  selectRole: async (role: 'client' | 'freelancer'): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put('/auth/select-role', { role });
      return response.data;
    } catch (error: any) {
      console.error('Select role error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to select role'
      };
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed'
      };
    }
  },

  // OTPless auth
  verifyOTPless: async (token: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/auth/otpless/verify', { token });
      return response.data;
    } catch (error: any) {
      console.error('OTPless verify error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'OTPless verification failed'
      };
    }
  }
};
