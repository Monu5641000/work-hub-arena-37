
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
  // Get all freelancers
  getFreelancers: async (params?: any): Promise<ApiResponse> => {
    try {
      const response = await api.get('/users/freelancers', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get freelancers error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch freelancers'
      };
    }
  },

  // Get freelancer profile by username
  getFreelancerProfile: async (username: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/users/profile/${username}`);
      return response.data;
    } catch (error: any) {
      console.error('Get freelancer profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch freelancer profile'
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

  // Update profile
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
  }
};
