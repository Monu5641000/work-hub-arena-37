
const API_BASE_URL = 'http://localhost:5000/api';

export interface ServiceData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  pricingPlans: {
    basic: {
      title: string;
      description: string;
      price: number;
      deliveryDays: number;
      revisions: number;
      features: string[];
    };
    standard?: {
      title: string;
      description: string;
      price: number;
      deliveryDays: number;
      revisions: number;
      features: string[];
    };
    premium?: {
      title: string;
      description: string;
      price: number;
      deliveryDays: number;
      revisions: number;
      features: string[];
    };
  };
  requirements?: Array<{
    question: string;
    type: 'text' | 'file' | 'multiple_choice';
    required: boolean;
    options?: string[];
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

class ServiceAPI {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAllServices(filters?: any) {
    const queryParams = new URLSearchParams(filters || {});
    const response = await fetch(`${API_BASE_URL}/services?${queryParams}`);
    return response.json();
  }

  async getService(id: string) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    return response.json();
  }

  async createService(serviceData: ServiceData) {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(serviceData),
    });
    return response.json();
  }

  async getMyServices(filters?: any) {
    const queryParams = new URLSearchParams(filters || {});
    const response = await fetch(`${API_BASE_URL}/services/my/services?${queryParams}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async updateService(id: string, serviceData: Partial<ServiceData>) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(serviceData),
    });
    return response.json();
  }

  async deleteService(id: string) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    return response.json();
  }
}

export const serviceAPI = new ServiceAPI();
