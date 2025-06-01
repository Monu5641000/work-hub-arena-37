
const API_BASE_URL = 'http://localhost:5000/api';

export interface OrderData {
  serviceId: string;
  packageType: 'basic' | 'standard' | 'premium';
  customRequirements?: Array<{
    question: string;
    answer: string;
    files?: Array<{
      filename: string;
      url: string;
      size: number;
    }>;
  }>;
  addOns?: Array<{
    name: string;
    price: number;
    deliveryDays: number;
  }>;
}

class OrderAPI {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createOrder(orderData: OrderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }

  async getMyOrders(filters?: any) {
    const queryParams = new URLSearchParams(filters || {});
    const response = await fetch(`${API_BASE_URL}/orders/my-orders?${queryParams}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async getOrder(id: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async updateOrderStatus(id: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  async submitDeliverables(id: string, deliverables: any[], message?: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/deliverables`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ deliverables, message }),
    });
    return response.json();
  }
}

export const orderAPI = new OrderAPI();
