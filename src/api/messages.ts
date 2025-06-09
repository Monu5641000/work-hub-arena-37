
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
      const response = await api.post('/messages/send', messageData);
      return response.data;
    } catch (error: any) {
      console.error('Send message error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  // Get conversation
  getConversation: async (userId: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get conversation error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch conversation'
      };
    }
  },

  // Get conversations list
  getConversationsList: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error: any) {
      console.error('Get conversations error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch conversations'
      };
    }
  },

  // Mark as read
  markAsRead: async (conversationId: string): Promise<ApiResponse> => {
    try {
      const response = await api.put('/messages/mark-read', { conversationId });
      return response.data;
    } catch (error: any) {
      console.error('Mark as read error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark as read'
      };
    }
  },

  // Get unread count
  getUnreadCount: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/messages/unread-count');
      return response.data;
    } catch (error: any) {
      console.error('Get unread count error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch unread count'
      };
    }
  }
};
