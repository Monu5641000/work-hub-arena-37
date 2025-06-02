
const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'client' | 'freelancer';
}

export interface RequirementsData {
  projectTypes?: string[];
  budget?: { min: number; max: number; };
  timeline?: string;
  experience?: string;
  serviceCategories?: string[];
  skillLevel?: string;
  availability?: string;
  preferredProjectSize?: string;
  workingHours?: {
    timezone: string;
    availability: string[];
  };
}

class AuthAPI {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async login(data: LoginData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData) {
    try {
      console.log('Registering user with data:', data);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      console.log('Registration response:', result);
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async updateRequirements(requirements: RequirementsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/requirements`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ requirements }),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update requirements');
      }

      localStorage.setItem('user', JSON.stringify(result.user));
      return result;
    } catch (error) {
      console.error('Update requirements error:', error);
      throw error;
    }
  }

  async getMe() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getAuthHeader(),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to get user data');
      }

      return result;
    } catch (error) {
      console.error('Get me error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export const authAPI = new AuthAPI();
