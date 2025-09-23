import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '@/store/cart-api';
import { useTranslations } from 'next-intl';
import {
  loginWithEmail,
  registerWithEmail,
  verifyOtp,
  googleAuth,
  logoutUser,
  updateUserProfile,
  setAccessToken,
  removeTokens
} from '@/services/auth';
import { RegisterRequest, UpdateProfileRequest } from '@/types/auth';

export const useAuthActions = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('auth.messages');

  const login = async (email: string): Promise<void> => {
    try {
      const response = await loginWithEmail({ email });

      if (response.success) {
        toast.success(t('login.success'));
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || t('login.error');
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      const response = await registerWithEmail(data);

      if (response.success) {
        toast.success(t('register.success'));
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || t('register.error');
      toast.error(message);
      throw error;
    }
  };

  const verifyOtpCode = async (email: string, code: string, type: 'register' | 'login' = 'register', returnUrl?: string): Promise<void> => {
    try {
      // Get sessionId from cart store for cart migration during login
      let sessionId: string | undefined;
      if (type === 'login') {
        const { sessionId: cartSessionId } = useCartStore.getState();
        sessionId = cartSessionId;
        console.log('Using sessionId for cart migration:', sessionId);
      }

      const response = await verifyOtp({ email, code }, type, sessionId);

      if (response.success && response.data) {
        setAccessToken(response.data.accessToken);
        
        // Invalidate all queries to refresh the entire app state
        await queryClient.invalidateQueries();
        
        // Force a small delay to ensure state is updated before navigation
        await new Promise(resolve => setTimeout(resolve, 200));
        
        toast.success(t('login.verifySuccess'));
        router.replace(decodeURIComponent(returnUrl || '/'));
      } else {
        throw new Error(response.message || 'Invalid verification code');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || t('login.verifyError');
      toast.error(message);
      throw error;
    }
  };

  const googleAuthentication = async (token: string): Promise<void> => {
    try {
      // Get sessionId from cart store for cart migration during Google login
      const { sessionId } = useCartStore.getState();
      console.log('Using sessionId for Google login cart migration:', sessionId);

      const response = await googleAuth({ googleToken: token, sessionId });

      if (response.success && response.data) {
        setAccessToken(response.data.accessToken);
        
        // Invalidate all queries to refresh the entire app state
        await queryClient.invalidateQueries();
        
        // Force a small delay to ensure state is updated before navigation
        await new Promise(resolve => setTimeout(resolve, 200));
        
        toast.success(t('google.success'));
        router.replace('/');
      } else {
        throw new Error(response.message || 'Google authentication failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || t('google.error');
      toast.error(message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      
      // Clear all queries and remove tokens
      queryClient.clear();
      removeTokens();
      
      // Set logged out state
      const { setLoggedIn } = useCartStore.getState();
      setLoggedIn(false);
      
      toast.success(t('logout.success'));
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      queryClient.clear();
      removeTokens();
      
      // Set logged out state even on error
      const { setLoggedIn } = useCartStore.getState();
      setLoggedIn(false);
      
      toast.success(t('logout.success'));
      router.replace('/');
    }
  };

  const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
    try {
      const updatedProfile = await updateUserProfile(data);
      
      // Update the profile in the cache
      queryClient.setQueryData(['profile'], updatedProfile);
      
      toast.success(t('profile.updateSuccess'));
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || t('profile.updateError');
      toast.error(message);
      throw error;
    }
  };

  return {
    login,
    register,
    verifyOtp: verifyOtpCode,
    googleAuth: googleAuthentication,
    logout,
    updateProfile,
  };
};
