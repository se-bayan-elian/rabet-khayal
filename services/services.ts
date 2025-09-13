import { axiosClient } from "@/lib/axios";
import {
  ServicesResponse,
  Service,
  ServiceDetailResponse,
  ProjectsResponse,
  PricingPlansResponse,
  Project,
  ContactFormRequest,
} from "@/types/services";

export const fetchServices = async ({
  page,
  limit,
  q,
}: {
  page: number;
  limit: number;
  q?: string;
}): Promise<ServicesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (q) params.append("q", q);

  const response = await axiosClient.get(`/services?${params.toString()}`);
  return response.data?.data;
};

export const fetchServiceById = async (serviceId: string): Promise<Service> => {
  const response = await axiosClient.get<ServiceDetailResponse>(
    `/services/${serviceId}`
  );
  return response.data.data;
};

export const fetchServiceProjects = async (
  serviceId: string
): Promise<Project[]> => {
  const response = await axiosClient.get(`/services/${serviceId}/projects`);
  return response.data?.data;
};

export const fetchProjectById = async (projectId: string): Promise<Project> => {
  const response = await axiosClient.get(`/services/projects/${projectId}`);
  return response.data?.data;
};

export const fetchServicePricingPlans = async (
  serviceId: string
): Promise<PricingPlansResponse> => {
  const response = await axiosClient.get(
    `/services/${serviceId}/pricing-plans`
  );
  return response.data?.data;
};

export const submitContactForm = async (
  data: ContactFormRequest
): Promise<any> => {
  const response = await axiosClient.post("/emails/contact-us", data);
  return response.data;
};
