import { useQuery } from '@tanstack/react-query';
import { getAccessToken, getUserProfile } from '@/services/auth';
import { User } from '@/types/auth';

export const useProfile = () => {
  const accessToken = getAccessToken();
  
  return useQuery({
    queryKey: ['profile', accessToken],
    queryFn: async (): Promise<User | null> => {
      // If no refresh token, user is not authenticated
      if (!accessToken) {
        return null;
      }
      
      try {
        const profile = await getUserProfile();
        return profile as unknown as User;
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        
        // If it's a 401 error, the global interceptor will handle token refresh
        // If refresh fails, the interceptor will redirect to login
        if (error?.response?.status === 401) {
          return null;
        }
        
        // For other errors, return null
        return null;
      }
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (global interceptor handles this)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useAuth = () => {
  const { data: user, isLoading, error } = useProfile();
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
  };
};