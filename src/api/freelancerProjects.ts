
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
  // Get freelancer projects
  getFreelancerProjects: async (params?: any): Promise<ApiResponse> => {
    try {
      const response = await api.get('/freelancer-projects', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get freelancer projects error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get projects'
      };
    }
  },

  // Create freelancer project
  createFreelancerProject: async (projectData: any): Promise<ApiResponse> => {
    try {
      const response = await api.post('/freelancer-projects', projectData);
      return response.data;
    } catch (error: any) {
      console.error('Create freelancer project error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create project'
      };
    }
  },

  // Update freelancer project
  updateFreelancerProject: async (id: string, projectData: any): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/freelancer-projects/${id}`, projectData);
      return response.data;
    } catch (error: any) {
      console.error('Update freelancer project error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update project'
      };
    }
  },

  // Delete freelancer project
  deleteFreelancerProject: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/freelancer-projects/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete freelancer project error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete project'
      };
    }
  }
};
