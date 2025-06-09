
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
  authProvider: 'otpless' | 'google' | 'email';
  otplessUserId?: string;
  googleId?: string;
  profilePicture?: string;
  location?: {
    country?: string;
    city?: string;
    address?: string;
  };
  title?: string;
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'expert';
  }>;
  hourlyRate?: number;
  portfolio?: Array<{
    title: string;
    description: string;
    imageUrl: string;
    projectUrl: string;
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
  languages?: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
  availability?: 'full-time' | 'part-time' | 'weekends' | 'flexible';
  rating?: {
    average: number;
    count: number;
  };
  isActive?: boolean;
  isVerified?: boolean;
  lastLogin?: Date;
  fullName?: string;
  requirements?: any;
  requirementsCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  token?: string;
  error?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  service: {
    _id: string;
    title: string;
    description: string;
  };
  client: User;
  freelancer: User;
  status: 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'revision_requested';
  totalAmount: number;
  freelancerEarnings: number;
  platformFee: number;
  deliveryDate: string;
  isOverdue: boolean;
  daysRemaining: number;
  progress: number;
  userRole: 'client' | 'freelancer';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  freelancer: User;
  images: string[];
  pricingPlans: {
    basic: PricingPlan;
    standard: PricingPlan;
    premium: PricingPlan;
  };
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlan {
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}
