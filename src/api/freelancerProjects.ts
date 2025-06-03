
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

export interface FreelancerProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  skills: string[];
  hashtags: string[];
  budget?: {
    type: 'fixed' | 'hourly';
    amount: {
      min: number;
      max: number;
    };
    currency: string;
  };
  duration?: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  freelancer: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating?: number;
    location?: string;
  };
  images: Array<{
    url: string;
    filename: string;
    originalName: string;
    size: number;
  }>;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  views: number;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export const freelancerProjectAPI = {
  async getAllProjects(params?: any): Promise<ApiResponse<FreelancerProject[]>> {
    const response = await api.get('/freelancer-projects', { params });
    return response.data as ApiResponse<FreelancerProject[]>;
  },

  async getProject(id: string): Promise<ApiResponse<FreelancerProject>> {
    const response = await api.get(`/freelancer-projects/${id}`);
    return response.data as ApiResponse<FreelancerProject>;
  },

  async createProject(projectData: FormData): Promise<ApiResponse<FreelancerProject>> {
    const response = await api.post('/freelancer-projects', projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as ApiResponse<FreelancerProject>;
  },

  async updateProject(id: string, projectData: FormData): Promise<ApiResponse<FreelancerProject>> {
    const response = await api.put(`/freelancer-projects/${id}`, projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as ApiResponse<FreelancerProject>;
  },

  async deleteProject(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/freelancer-projects/${id}`);
    return response.data as ApiResponse;
  },

  async getMyProjects(params?: any): Promise<ApiResponse<FreelancerProject[]>> {
    const response = await api.get('/freelancer-projects/my/projects', { params });
    return response.data as ApiResponse<FreelancerProject[]>;
  }
};
