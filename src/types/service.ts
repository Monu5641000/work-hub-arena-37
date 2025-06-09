
export interface PricingPlan {
  title?: string;
  description?: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  features: string[];
}

export interface ServicePricingPlans {
  basic: PricingPlan;
  standard?: PricingPlan;
  premium?: PricingPlan;
}

export interface ServiceImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ServiceAddOn {
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
}

export interface ServiceFreelancer {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  username?: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  freelancer: ServiceFreelancer;
  images: ServiceImage[];
  pricingPlans: ServicePricingPlans;
  addOns: ServiceAddOn[];
  status: string;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  impressions: number;
  clicks: number;
  orders: number;
  createdAt: string;
  updatedAt: string;
}
