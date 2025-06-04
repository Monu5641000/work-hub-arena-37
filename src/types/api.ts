export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'client' | 'freelancer' | 'admin';
  avatar?: string;
  isVerified: boolean;
  needsRoleSelection?: boolean;
  roleSelected?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  freelancer: User;
  pricingPlans: {
    basic: {
      price: number;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
    standard?: {
      price: number;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
    premium?: {
      price: number;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  status: 'active' | 'paused' | 'pending' | 'rejected';
  averageRating: number;
  totalReviews: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: {
    type: 'fixed' | 'hourly';
    amount: {
      min: number;
      max: number;
    };
  };
  duration: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  client: User;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  proposals?: Proposal[];
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  _id: string;
  project: Project;
  freelancer: User;
  coverLetter: string;
  proposedBudget: {
    type: 'fixed' | 'hourly';
    amount: number;
  };
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: string;
  respondedAt?: string;
  clientMessage?: string;
}

export interface Order {
  _id: string;
  service?: Service;
  project?: Project;
  client: User;
  freelancer: User;
  status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
  totalAmount: number;
  freelancerEarnings: number;
  progress: number;
  daysRemaining: number;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}
