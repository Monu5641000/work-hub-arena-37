
const API_BASE_URL = 'http://localhost:5000/api';

export interface ProjectData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  skills: string[];
  budget: {
    type: 'fixed' | 'hourly';
    amount: {
      min: number;
      max: number;
    };
    currency: string;
  };
  duration: string;
  experienceLevel: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
}

class ProjectAPI {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAllProjects(filters?: any) {
    const queryParams = new URLSearchParams(filters || {});
    const response = await fetch(`${API_BASE_URL}/projects?${queryParams}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async getProject(id: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async createProject(projectData: ProjectData) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(projectData),
    });
    return response.json();
  }

  async getMyProjects(filters?: any) {
    const queryParams = new URLSearchParams(filters || {});
    const response = await fetch(`${API_BASE_URL}/projects/my/projects?${queryParams}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async updateProject(id: string, projectData: Partial<ProjectData>) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(projectData),
    });
    return response.json();
  }

  async deleteProject(id: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    return response.json();
  }
}

export const projectAPI = new ProjectAPI();
