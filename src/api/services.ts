
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
  getServices: async (params?: any): Promise<ApiResponse<Service[]>> => {
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

  // Alias for compatibility
  getAllServices: async (params?: any): Promise<ApiResponse<Service[]>> => {
    return serviceAPI.getServices(params);
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
      // Convert plain object to FormData if needed
      let formData = serviceData;
      if (!(serviceData instanceof FormData)) {
        formData = new FormData();
        Object.keys(serviceData).forEach(key => {
          if (typeof serviceData[key] === 'object' && serviceData[key] !== null) {
            formData.append(key, JSON.stringify(serviceData[key]));
          } else {
            formData.append(key, serviceData[key]);
          }
        });
      }

      const response = await api.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
  updateService: async (id: string, serviceData: FormData): Promise<ApiResponse<Service>> => {
    try {
      const response = await api.put(`/services/${id}`, serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      const response = await api.get('/services/my-services');
      return response.data;
    } catch (error: any) {
      console.error('Get my services error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch your services'
      };
    }
  },

  // Search services
  searchServices: async (query: string, filters?: any): Promise<ApiResponse> => {
    try {
      const response = await api.get('/services/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error: any) {
      console.error('Search services error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search services'
      };
    }
  }
};
