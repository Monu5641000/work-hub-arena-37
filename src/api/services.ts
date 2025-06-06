
import axios from 'axios';
import { ApiResponse, Service } from '@/types/api';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const serviceAPI = {
  async getAllServices(params?: any): Promise<ApiResponse<Service[]>> {
    const response = await api.get('/services', { params });
    return response.data;
  },

  async getService(id: string): Promise<ApiResponse<Service>> {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async createService(serviceData: any): Promise<ApiResponse<Service>> {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  async updateService(id: string, serviceData: any): Promise<ApiResponse<Service>> {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  async deleteService(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  async getMyServices(params?: any): Promise<ApiResponse<Service[]>> {
    const response = await api.get('/services/my/services', { params });
    return response.data;
  },

  async uploadServiceImages(id: string, images: FormData): Promise<ApiResponse<any>> {
    const response = await api.post(`/services/${id}/images`, images, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getServiceAnalytics(id: string): Promise<ApiResponse<any>> {
    const response = await api.get(`/services/${id}/analytics`);
    return response.data;
  }
};
