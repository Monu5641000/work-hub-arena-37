
import axios from 'axios';
import { ApiResponse, Order } from '@/types/api';

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

export const orderAPI = {
  // Create order
  createOrder: async (orderData: any): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error: any) {
      console.error('Create order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order'
      };
    }
  },

  // Get my orders
  getMyOrders: async (params?: any): Promise<ApiResponse<Order[]>> => {
    try {
      const response = await api.get('/orders/my-orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get my orders error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  },

  // Get single order
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order'
      };
    }
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Update order status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update order status'
      };
    }
  },

  // Submit deliverables
  submitDeliverables: async (id: string, data: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/orders/${id}/deliverables`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Submit deliverables error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit deliverables'
      };
    }
  },

  // Request revision
  requestRevision: async (id: string, message: string): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/orders/${id}/revision`, { message });
      return response.data;
    } catch (error: any) {
      console.error('Request revision error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to request revision'
      };
    }
  },

  // Get order analytics
  getOrderAnalytics: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/orders/analytics');
      return response.data;
    } catch (error: any) {
      console.error('Get order analytics error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch analytics'
      };
    }
  }
};
