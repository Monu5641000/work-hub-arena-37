
import axios from 'axios';
import { ApiResponse } from '@/types/api';

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

export const orderAPI = {
  async createOrder(orderData: any): Promise<ApiResponse> {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getMyOrders(params?: any): Promise<ApiResponse> {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  async getOrder(id: string): Promise<ApiResponse> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: string, statusData: any): Promise<ApiResponse> {
    const response = await api.put(`/orders/${id}/status`, statusData);
    return response.data;
  },

  async submitDeliverables(id: string, deliverables: any): Promise<ApiResponse> {
    const response = await api.put(`/orders/${id}/deliverables`, deliverables);
    return response.data;
  }
};
