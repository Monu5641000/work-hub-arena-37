
const API_BASE_URL = 'http://localhost:5000/api';

export interface MessageData {
  recipientId: string;
  content: string;
  messageType?: 'text' | 'file' | 'image';
  files?: any[];
}

export interface AdminMessageData {
  recipientId: string;
  content: string;
}

class MessageAPI {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async sendMessage(messageData: MessageData) {
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(messageData),
    });
    return response.json();
  }

  async getConversation(userId: string, page = 1, limit = 50) {
    const response = await fetch(`${API_BASE_URL}/messages/conversation/${userId}?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async getConversationsList() {
    const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async markAsRead(conversationId: string) {
    const response = await fetch(`${API_BASE_URL}/messages/mark-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ conversationId }),
    });
    return response.json();
  }

  async getUnreadCount() {
    const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  // Admin methods
  async getAdminUsers(page = 1, limit = 20, search = '') {
    const response = await fetch(`${API_BASE_URL}/messages/admin/users?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async adminSendMessage(messageData: AdminMessageData) {
    const response = await fetch(`${API_BASE_URL}/messages/admin/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(messageData),
    });
    return response.json();
  }
}

export const messageAPI = new MessageAPI();
