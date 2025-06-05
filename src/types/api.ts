
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
  email?: string;
  phoneNumber?: string;
  role?: 'client' | 'freelancer' | 'admin';
  profilePicture?: string;
  needsRoleSelection?: boolean;
  roleSelected?: boolean;
  isVerified: boolean;
  location?: string;
  bio?: string;
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'expert';
  }>;
  hourlyRate?: number;
  rating?: {
    average: number;
    count: number;
  };
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
  orders: number;
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
  orderNumber: string;
  service?: Service;
  project?: Project;
  client: User;
  freelancer: User;
  selectedPlan: 'basic' | 'standard' | 'premium';
  requirements: string;
  addOns: Array<{
    title: string;
    price: number;
    deliveryTime?: number;
  }>;
  status: 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'revision_requested' | 'completed' | 'cancelled' | 'disputed';
  totalAmount: number;
  platformFee: number;
  freelancerEarnings: number;
  deliveryDate: string;
  actualDeliveryDate?: string;
  progress: number;
  daysRemaining: number;
  isOverdue: boolean;
  userRole?: 'client' | 'freelancer';
  deliverables: Array<{
    files: Array<{
      fileName: string;
      fileUrl: string;
      fileSize: number;
      fileType: string;
    }>;
    message: string;
    submittedAt: string;
  }>;
  revisions: Array<{
    reason: string;
    requestedAt: string;
    resolvedAt?: string;
  }>;
  statusHistory: Array<{
    status: string;
    updatedBy: string;
    updatedAt: string;
    note?: string;
  }>;
  rating?: {
    clientRating?: {
      score: number;
      comment: string;
      ratedAt: string;
    };
    freelancerRating?: {
      score: number;
      comment: string;
      ratedAt: string;
    };
  };
  dispute?: {
    isDisputed: boolean;
    reason?: string;
    status?: 'open' | 'resolved' | 'closed';
    initiatedBy?: string;
    initiatedAt?: string;
    resolvedAt?: string;
    resolution?: string;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
  tags: string[];
  notes: Array<{
    content: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  completedOrders: number;
  completionRate: string;
  totalEarnings: number;
  avgDeliveryTime: number;
  recentOrdersCount: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  servicesCount: number;
  createdAt: string;
  updatedAt: string;
}
