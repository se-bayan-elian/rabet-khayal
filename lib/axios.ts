
import { API_BASE_URL } from "@/config/constant";
import { getAccessToken, removeTokens } from "@/services/auth";
import axios from "axios";

export const axiosAuthClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Refresh token logic removed - access tokens now last 7 days

// Axios interceptor for adding auth token
axiosAuthClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    console.log('🔑 axiosAuthClient interceptor:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      url: config.url,
      method: config.method
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('❌ No token found, Authorization header NOT added');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor for handling auth errors
axiosAuthClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 errors by clearing tokens and redirecting to login
    if (error.response?.status === 401) {
      removeTokens();
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

