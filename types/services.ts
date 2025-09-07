import { PaginationMeta } from "./common";

export type ServicesResponse = {
  data: Service[];
  meta: PaginationMeta;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  projectCount: number;
  isActive: boolean;
  displayOrder: number;
  projects?: Project[];
  pricingPlans?: PricingPlan[];
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  mainImageUrl?: string;
  gallery?: {
    url: string;
    public_id: string;
  }[];
  projectUrl?: string;
  clientName?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
  service?: Service;
};

export type PricingPlan = {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  originalPrice: number;
  finalPrice: number;
  billingPeriod: string;
  deliveryDays?: number;
  revisions?: number;
  isPopular: boolean;
  isActive: boolean;
  displayOrder: number;
  features?: Feature[];
  createdAt: string;
  updatedAt: string;
  service?: Service;
};

export type Feature = {
  id: string;
  pricingPlanId: string;
  name: string;
  description?: string;
  isIncluded: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  pricingPlan?: PricingPlan;
};

export type ContactFormRequest = {
  name: string;
  email: string;
  serviceId: string;
  pricingPlanId?: string;
  message: string;
  phone?: string;
  company?: string;
};

export type ServiceDetailResponse = {
  data: Service;
  success: boolean;
  message: string;
};

export type ProjectsResponse = {
  data: Project[];
  meta: PaginationMeta;
};

export type PricingPlansResponse = {
  data: PricingPlan[];
  meta: PaginationMeta;
};
