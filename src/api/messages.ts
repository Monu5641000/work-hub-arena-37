
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

export const messageAPI = {
  // Send message
  sendMessage: async (messageData: any): Promise<ApiResponse> => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error: any) {
      console.error('Send message error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  // Get conversations
  getConversations: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error: any) {
      console.error('Get conversations error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get conversations'
      };
    }
  },

  // Get messages
  getMessages: async (conversationId: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/messages/${conversationId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get messages error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get messages'
      };
    }
  },

  // Mark as read
  markAsRead: async (conversationId: string): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/messages/${conversationId}/read`);
      return response.data;
    } catch (error: any) {
      console.error('Mark as read error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark as read'
      };
    }
  },

  // Get admin users
  getAdminUsers: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/messages/admin/users');
      return response.data;
    } catch (error: any) {
      console.error('Get admin users error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get users'
      };
    }
  }
};
