
import axios from 'axios';
import { ApiResponse } from '@/types/api';

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

export const userAPI = {
  // Get user profile
  getProfile: async (userId?: string): Promise<ApiResponse> => {
    try {
      const endpoint = userId ? `/users/${userId}` : '/users/profile';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData: any): Promise<ApiResponse> => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Check username availability
  checkUsername: async (username: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/users/check-username/${username}`);
      return response.data;
    } catch (error: any) {
      console.error('Check username error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check username'
      };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.post('/users/profile-picture', file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Upload profile picture error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload profile picture'
      };
    }
  },

  // Search freelancers
  searchFreelancers: async (params: any): Promise<ApiResponse> => {
    try {
      const response = await api.get('/users/search/freelancers', { params });
      return response.data;
    } catch (error: any) {
      console.error('Search freelancers error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search freelancers'
      };
    }
  }
};
