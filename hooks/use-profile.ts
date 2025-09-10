"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/services/auth";
import { UserProfile } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

export const PROFILE_QUERY_KEY = ["profile"];

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      try {
        const profile = await getUserProfile();
        return profile;
      } catch (error: any) {
        // If 401, the axios interceptor will handle token refresh
        // If refresh fails, it will redirect to login
        throw error;
      }
    },
    enabled: false, // Disable automatic fetching to avoid loops
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors, let the interceptor handle it
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  };
};

// Server-side profile fetching for hydration
export const fetchProfileForHydration = async (): Promise<UserProfile | null> => {
  try {
    const profile = await getUserProfile();
    return profile;
  } catch (error) {
    // On server, if there's no valid token, return null
    // The client will handle the authentication flow
    return null;
  }
};
