
import axios from 'axios';

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
  async createOrder(orderData: any) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getMyOrders(params?: any) {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  async getOrder(id: string) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: string, statusData: any) {
    const response = await api.put(`/orders/${id}/status`, statusData);
    return response.data;
  },

  async submitDeliverables(id: string, deliverables: any) {
    const response = await api.put(`/orders/${id}/deliverables`, deliverables);
    return response.data;
  }
};
