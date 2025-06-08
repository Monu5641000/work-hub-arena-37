
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

export const freelancerProjectAPI = {
  // Get all freelancer projects (public)
  getAllProjects: async (params?: any): Promise<ApiResponse> => {
    try {
      const response = await api.get('/freelancer-projects', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get all freelancer projects error:', error);
      throw error;
    }
  },

  // Get single freelancer project
  getProject: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/freelancer-projects/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get freelancer project error:', error);
      throw error;
    }
  },

  // Get my freelancer projects
  getMyProjects: async (params?: any): Promise<ApiResponse> => {
    try {
      const response = await api.get('/freelancer-projects/my/projects', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get my freelancer projects error:', error);
      throw error;
    }
  },

  // Create freelancer project
  createProject: async (formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.post('/freelancer-projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Create freelancer project error:', error);
      throw error;
    }
  },

  // Update freelancer project
  updateProject: async (id: string, formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/freelancer-projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Update freelancer project error:', error);
      throw error;
    }
  },

  // Delete freelancer project
  deleteProject: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/freelancer-projects/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete freelancer project error:', error);
      throw error;
    }
  }
};
