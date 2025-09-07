import { axiosClient } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
}

export interface ServiceItem {
  id: string;
  name: string | { en?: string; ar?: string };
  description?: string | { en?: string; ar?: string };
  icon?: string | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  imageUrl?: string | null;
  iconUrl?: string | null;
  subcategories?: SubcategoryItem[];
}

export interface SubcategoryItem {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  questionText: string;
  type: "select" | "text" | "note" | "checkbox" | "image";
  required: boolean;
  answers: ProductAnswer[];
}

export interface ProductAnswer {
  id: string;
  optionId: string;
  answerText: string;
  imageUrl?: string;
  imagePublicId?: string;
  extraPrice: number;
}

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  productId: string;
  userId: string;
  user: ReviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  content: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description?: string;
  originalPrice: string;
  discountedPrice?: string;
  imageUrl?: string | null;
  imagePublicId?: string;
  isFeatured: boolean;
  isAvailable?: boolean;
  stock?: number;
  weight?: string;
  subcategoryId: string;
  subcategory?: {
    id: string;
    name: string;
    description: string;
  };
  questions?: ProductQuestion[];
  averageRating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  // Computed properties for compatibility
  price?: number;
  salePrice?: number;
  isInStock?: boolean;
}

export async function fetchServices(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await axiosClient.get<PaginatedResponse<ServiceItem>>(
    "/services",
    { params }
  );
  return data.data ?? [];
}

export async function fetchCategories(params?: {
  pagination?: { page?: number; limit?: number };
  search?: { query?: string };
}) {
  const merged = {
    ...params,
    pagination: {
      page: params?.pagination?.page ?? 1,
      limit: params?.pagination?.limit ?? 10,
    },
  };
  const { data } = await axiosClient.get<any>("/categories", {
    params: merged,
  });
  // API shape: { success, data: { data: Category[], meta }, message }
  return data?.data?.data ?? [];
}

export function useServicesQuery(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => fetchServices(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoriesQuery(params?: {
  pagination?: { page?: number; limit?: number };
  search?: { query?: string };
}) {
  return useQuery({
    queryKey: ["categories", params ?? { pagination: { page: 1, limit: 10 } }],
    queryFn: () => fetchCategories(params),
    staleTime: 1000 * 60 * 5,
  });
}

export async function fetchSubcategories(
  categoryId: string,
  params?: { pagination?: { page?: number; limit?: number } }
) {
  const merged = {
    pagination: {
      page: params?.pagination?.page ?? 1,
      limit: params?.pagination?.limit ?? 12,
    },
  };
  const { data } = await axiosClient.get<PaginatedResponse<SubcategoryItem>>(
    `/categories/${categoryId}/subcategories`,
    { params: merged }
  );
  return data.data ?? [];
}

export function useSubcategoriesQuery(
  categoryId: string,
  params?: { pagination?: { page?: number; limit?: number } }
) {
  return useQuery({
    queryKey: [
      "subcategories",
      categoryId,
      params ?? { pagination: { page: 1, limit: 12 } },
    ],
    queryFn: () => fetchSubcategories(categoryId, params),
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 5,
  });
}

export async function fetchProducts(params: {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}) {
  const { data } = await axiosClient.get<PaginatedResponse<ProductItem>>(
    `/products`,
    { params }
  );
  return data;
}

export async function fetchProductsBySubCategory(params: {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  if (!params.subcategoryId) {
    throw new Error("subcategoryId is required");
  }

  // Extract subcategoryId from params for the URL
  const { subcategoryId, ...queryParams } = params;

  const { data } = await axiosClient.get<PaginatedResponse<ProductItem>>(
    `/products/subcategory/${subcategoryId}`,
    { params: queryParams }
  );
  return data;
}

export function useProductsQuery(params: {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });
}
export function useProductsBySubCategoryQuery(params: {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: ["products-sub", params],
    queryFn: () => fetchProductsBySubCategory(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });
}

// Cart APIs (backend sync)
export async function fetchCart() {
  const { data } = await axiosClient.get(`/carts/my`);
  return data;
}

export async function addToCartApi(payload: {
  productId: string;
  quantity: number;
  options?: Record<string, any>;
}) {
  const { data } = await axiosClient.post(`/carts/items`, payload);
  return data;
}

export async function removeFromCartApi(itemId: string) {
  const { data } = await axiosClient.delete(`/carts/items/${itemId}`);
  return data;
}

// Product details
export async function fetchProductById(productId: string) {
  const { data } = await axiosClient.get<{
    success: boolean;
    data: ProductItem;
    message: string;
  }>(`/products/${productId}`);
  return data.data;
}

export function useProductQuery(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}

// Reviews API
export async function fetchProductReviews(
  productId: string,
  params?: {
    rating?: number;
    sort?: "newest" | "oldest" | "highest" | "lowest";
    page?: number;
    limit?: number;
  }
) {
  const { data } = await axiosClient.get<ReviewsResponse>(
    `/reviews/product/${productId}`,
    { params }
  );
  return data?.data;
}

export function useProductReviewsQuery(
  productId: string,
  params?: {
    rating?: number;
    sort?: "newest" | "oldest" | "highest" | "lowest";
    page?: number;
    limit?: number;
  }
) {
  return useQuery({
    queryKey: ["reviews", productId, params],
    queryFn: () => fetchProductReviews(productId, params),
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
  });
}

export async function createReview(reviewData: CreateReviewData) {
  const { data } = await axiosClient.post<{
    success: boolean;
    data: Review;
    message: string;
  }>("/reviews", reviewData);
  return data.data;
}

// Related products
export async function fetchRelatedProducts(
  productId: string,
  limit: number = 6
) {
  const { data } = await axiosClient.get<ProductItem[]>(
    `/products/${productId}/related?limit=${limit}`
  );
  return data?.data;
}

export function useRelatedProductsQuery(productId: string, limit: number = 6) {
  return useQuery({
    queryKey: ["related-products", productId, limit],
    queryFn: () => fetchRelatedProducts(productId, limit),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}

// Featured products for homepage
export async function fetchFeaturedProducts(limit: number = 6) {
  const { data } = await axiosClient.get(`/products/featured?limit=${limit}`);
  console.log(data);
  return data?.data;
}

export function useFeaturedProductsQuery(limit: number = 6) {
  return useQuery({
    queryKey: ["featured-products", limit],
    queryFn: () => fetchFeaturedProducts(limit),
    staleTime: 1000 * 60 * 10,
  });
}

// Featured services for homepage
export async function fetchFeaturedServices(limit: number = 6) {
  const { data } = await axiosClient.get<PaginatedResponse<ServiceItem>>(
    `/services/featured?limit=${limit}`
  );
  return data.data?.data || [];
}

export function useFeaturedServicesQuery(limit: number = 6) {
  return useQuery({
    queryKey: ["featured-services", limit],
    queryFn: () => fetchFeaturedServices(limit),
    staleTime: 1000 * 60 * 10,
  });
}

// Banner interface
export interface BannerItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Banners API
export async function fetchActiveBanners(limit?: number) {
  const { data } = await axiosClient.get<BannerItem[]>(`/banners/active`, {
    params: limit ? { limit } : undefined,
  });
  return data;
}

export function useBannersQuery(limit?: number) {
  return useQuery({
    queryKey: ["banners", limit],
    queryFn: () => fetchActiveBanners(limit),
    staleTime: 1000 * 60 * 5,
  });
}

// Featured reviews/testimonials
export async function fetchFeaturedReviews() {
  const { data } = await axiosClient.get(`/reviews/featured`);
  return data?.data;
}

export function useFeaturedReviewsQuery() {
  return useQuery({
    queryKey: ["featured-reviews"],
    queryFn: () => fetchFeaturedReviews(),
    staleTime: 1000 * 60 * 10,
  });
}

// Coupon interface
export interface CouponItem {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  isActive: boolean;
  isValid: boolean;
  startDate: string;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  usageLimitPerUser?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidationResponse {
  coupon: CouponItem;
  discount: number;
  isValid: boolean;
  message?: string;
}

// Coupon API functions
export async function validateCoupon(code: string, orderTotal: number) {
  const response = await axiosClient.post(`/coupons/validate`, {
    code,
    orderTotal,
  });

  // Extract the actual validation data from the wrapped response
  const validationData = response.data?.data || response.data;

  return validationData;
}
