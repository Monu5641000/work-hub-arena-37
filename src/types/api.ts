
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

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  skills: string[];
  budget: {
    type: 'fixed' | 'hourly';
    amount: number;
    currency: string;
  };
  duration: string;
  client: User;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  proposals?: Proposal[];
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  _id: string;
  project: Project | string;
  freelancer: User;
  coverLetter: string;
  proposedBudget: {
    amount: number;
    currency: string;
  };
  deliveryTime: number;
  status: 'pending' | 'accepted' | 'rejected';
  attachments?: string[];
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
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  pricingPlans: {
    basic: {
      title?: string;
      description?: string;
      price: number;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
    standard?: {
      title?: string;
      description?: string;
      price: number;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
    premium?: {
      title?: string;
      description?: string;
      price: number;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
  };
  addOns?: {
    title: string;
    description: string;
    price: number;
    deliveryTime: number;
  }[];
  isActive: boolean;
  clicks: number;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}
