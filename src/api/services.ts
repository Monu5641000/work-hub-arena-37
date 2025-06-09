
import axios from 'axios';
import { ApiResponse, Service } from '@/types/api';

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

export const serviceAPI = {
  // Get all services
  getAllServices: async (params?: any): Promise<ApiResponse<Service[]>> => {
    try {
      const response = await api.get('/services', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get services error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch services'
      };
    }
  },

  // Get single service
  getService: async (id: string): Promise<ApiResponse<Service>> => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get service error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch service'
      };
    }
  },

  // Create service
  createService: async (serviceData: any): Promise<ApiResponse<Service>> => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error: any) {
      console.error('Create service error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create service'
      };
    }
  },

  // Update service
  updateService: async (id: string, serviceData: any): Promise<ApiResponse<Service>> => {
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error: any) {
      console.error('Update service error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update service'
      };
    }
  },

  // Delete service
  deleteService: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete service error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete service'
      };
    }
  },

  // Get my services
  getMyServices: async (): Promise<ApiResponse<Service[]>> => {
    try {
      const response = await api.get('/services/my/services');
      return response.data;
    } catch (error: any) {
      console.error('Get my services error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch your services'
      };
    }
  },

  // Upload service images
  uploadServiceImages: async (id: string, images: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/services/${id}/images`, images, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Upload service images error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload images'
      };
    }
  }
};
