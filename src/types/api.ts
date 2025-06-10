
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UsernameCheckResponse {
  success: boolean;
  available: boolean;
  message?: string;
}

// Extend Window interface for custom properties
declare global {
  interface Window {
    usernameTimeout?: NodeJS.Timeout;
  }
}
