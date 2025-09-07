import { axiosClient } from "@/lib/axios";
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
  GOOGLE_AUTH: "/auth/google",
  REFRESH_TOKEN: "/auth/refresh",
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
  Cookies.remove("refreshToken"); // Backend sets this
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
  type: "register" | "login" = "register"
): Promise<AuthResponse> => {
  const endpoint =
    type === "register"
      ? AUTH_ENDPOINTS.VERIFY_OTP
      : AUTH_ENDPOINTS.VERIFY_LOGIN;
  const response = await axiosClient.post<AuthResponse>(endpoint, data);
  return response.data;
};

export const googleAuth = async (
  data: GoogleAuthRequest
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    AUTH_ENDPOINTS.GOOGLE_AUTH,
    data
  );
  return response.data;
};

export const refreshAuthToken = async (): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    AUTH_ENDPOINTS.REFRESH_TOKEN
  );
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    removeTokens();
  }
};

// User profile APIs
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosClient.get<{ data: UserProfile }>(
    AUTH_ENDPOINTS.PROFILE
  );
  return response.data.data;
};

export const updateUserProfile = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  const response = await axiosClient.patch<{ data: UserProfile }>(
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
  const response = await axiosClient.get(AUTH_ENDPOINTS.ORDERS, { params });
  return response.data;
};

export const getUserOrderStats = async (): Promise<{
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}> => {
  const response = await axiosClient.get(AUTH_ENDPOINTS.ORDER_STATS);
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await axiosClient.get<{ data: Order }>(`/orders/${orderId}`);
  return response.data.data;
};

// Axios interceptor for adding auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor for handling auth errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await refreshAuthToken();
        setAccessToken(response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        removeTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
