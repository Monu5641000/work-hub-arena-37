
const API_BASE_URL = 'http://localhost:5000/api';

export interface ProposalData {
  coverLetter: string;
  proposedBudget: {
    type: 'fixed' | 'hourly';
    amount: number;
    currency: string;
  };
  estimatedDuration: string;
  milestones?: Array<{
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
}

class ProposalAPI {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getProposalsForProject(projectId: string, page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/proposals/project/${projectId}?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async submitProposal(projectId: string, proposalData: ProposalData) {
    const response = await fetch(`${API_BASE_URL}/proposals/project/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(proposalData),
    });
    return response.json();
  }

  async getMyProposals(filters?: any) {
    const queryParams = new URLSearchParams(filters || {});
    const response = await fetch(`${API_BASE_URL}/proposals/my-proposals?${queryParams}`, {
      headers: this.getAuthHeader(),
    });
    return response.json();
  }

  async updateProposalStatus(proposalId: string, status: string, clientMessage?: string) {
    const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ status, clientMessage }),
    });
    return response.json();
  }
}

export const proposalAPI = new ProposalAPI();
