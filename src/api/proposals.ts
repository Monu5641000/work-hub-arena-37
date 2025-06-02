
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

export const proposalAPI = {
  async getProposalsForProject(projectId: string, params?: any) {
    const response = await api.get(`/proposals/project/${projectId}`, { params });
    return response.data;
  },

  async submitProposal(projectId: string, proposalData: any) {
    const response = await api.post(`/proposals/project/${projectId}`, proposalData);
    return response.data;
  },

  async updateProposalStatus(id: string, statusData: any) {
    const response = await api.put(`/proposals/${id}/status`, statusData);
    return response.data;
  },

  async getMyProposals(params?: any) {
    const response = await api.get('/proposals/my-proposals', { params });
    return response.data;
  }
};
