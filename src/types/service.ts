
export interface PricingPlan {
  title: string;
  description: string;
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

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  freelancer: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  pricingPlans: ServicePricingPlans;
  addOns: Array<{
    title: string;
    description: string;
    price: number;
    deliveryTime: number;
  }>;
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
