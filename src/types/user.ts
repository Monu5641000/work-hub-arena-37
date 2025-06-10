
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  role: 'client' | 'freelancer' | 'admin';
  roleSelected: boolean;
  authProvider: 'otpless' | 'google' | 'email';
  otplessUserId?: string;
  googleId?: string;
  requirements?: any;
  requirementsCompleted: boolean;
  profilePicture?: string;
  location?: string;
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'expert';
  }>;
  hourlyRate?: number;
  portfolio?: Array<{
    title: string;
    description: string;
    imageUrl?: string;
    projectUrl?: string;
  }>;
  bio?: string;
  experience?: string;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear: number;
  }>;
  rating?: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}
