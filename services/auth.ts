import { axiosAuthClient, axiosClient } from "@/lib/axios";
import {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  GoogleAuthRequest,
  AuthResponse,
  User,
  UserProfile,
  UpdateProfileRequest,
  Order,
} from "@/types/auth";
import Cookies from "js-cookie";



const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/sign-up", // Backend uses sign-up
  VERIFY_OTP: "/auth/sign-up-verification", // Backend uses sign-up-verification
  VERIFY_LOGIN: "/auth/verify-login", // Separate endpoint for login verification
  GOOGLE_URL: "/auth/google/url", // Get Google OAuth URL
  GOOGLE_CALLBACK: "/auth/google/callback", // Google OAuth callback
  // REFRESH_TOKEN: "/auth/refresh", // Removed - no longer using refresh tokens
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile",
  ORDERS: "/orders/my-orders", // Backend uses my-orders
  ORDER_STATS: "/orders/my-stats",
};

// Cookie management
export const getAccessToken = (): string | undefined => {
  return Cookies.get("accessToken");
};

export const setAccessToken = (token: string): void => {
  Cookies.set("accessToken", token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const removeTokens = (): void => {
  Cookies.remove("accessToken");
  // No refresh token to remove
};

// Authentication API calls
export const loginWithEmail = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    AUTH_ENDPOINTS.LOGIN,
    data
  );
  return response.data;
};

export const registerWithEmail = async (
  data: RegisterRequest
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosClient.post(AUTH_ENDPOINTS.REGISTER, data);
  return response.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest,
  type: "register" | "login" = "register",
  sessionId?: string
): Promise<AuthResponse> => {
  const endpoint =
    type === "register"
      ? AUTH_ENDPOINTS.VERIFY_OTP
      : AUTH_ENDPOINTS.VERIFY_LOGIN;
  
  // Include sessionId for login verification to enable cart migration
  const requestData = type === "login" && sessionId 
    ? { ...data, sessionId }
    : data;
    
  const response = await axiosClient.post<AuthResponse>(endpoint, requestData);
  return response.data;
};

export const getGoogleAuthUrl = async (): Promise<{ url: string }> => {
  const response = await axiosClient.get(AUTH_ENDPOINTS.GOOGLE_URL);
  return response.data?.data; 
};

export const googleAuth = async (
  data: GoogleAuthRequest & { sessionId?: string }
): Promise<AuthResponse> => {
  const response = await axiosClient.get<AuthResponse>(
    AUTH_ENDPOINTS.GOOGLE_CALLBACK,
    { params: {
      code : data.googleToken,
      sessionId: data.sessionId
    } }
  );
  return response.data;
};

// Refresh token functions removed - access tokens now last 7 days

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosAuthClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    removeTokens();
  }
};

// User profile APIs
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosAuthClient.get<{ data: UserProfile }>(
    AUTH_ENDPOINTS.PROFILE
  );
  return response.data.data;
};

export const updateUserProfile = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  const response = await axiosAuthClient.patch<{ data: UserProfile }>(
    AUTH_ENDPOINTS.UPDATE_PROFILE,
    data
  );
  return response.data.data;
};

// Orders API
export const getUserOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{ data: Order[]; meta: any }> => {
  const response = await axiosAuthClient.get(AUTH_ENDPOINTS.ORDERS, { params });
  return response.data;
};

export const getUserOrderStats = async (): Promise<{
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}> => {
  const response = await axiosAuthClient.get(AUTH_ENDPOINTS.ORDER_STATS);
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await axiosAuthClient.get<{ data: Order }>(`/orders/${orderId}`);
  return response.data.data;
};
