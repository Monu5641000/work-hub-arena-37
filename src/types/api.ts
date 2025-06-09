
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  token?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  role?: 'client' | 'freelancer' | 'admin';
  roleSelected?: boolean;
  needsRoleSelection?: boolean;
  profilePicture?: string;
  authProvider: 'otpless' | 'google' | 'email';
  isActive: boolean;
  isVerified: boolean;
  requirementsCompleted: boolean;
  requirements?: any;
  createdAt: string;
  updatedAt: string;
}
