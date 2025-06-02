
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

export const projectAPI = {
  async getAllProjects(params?: any) {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  async getProject(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(projectData: any) {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  async updateProject(id: string, projectData: any) {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  async deleteProject(id: string) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  async getMyProjects(params?: any) {
    const response = await api.get('/projects/my/projects', { params });
    return response.data;
  }
};
