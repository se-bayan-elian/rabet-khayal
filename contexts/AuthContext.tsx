"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AuthContextType,
  User,
  RegisterRequest,
  UpdateProfileRequest
} from '@/types/auth';
import {
  loginWithEmail,
  registerWithEmail,
  verifyOtp,
  googleAuth,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAccessToken,
  setAccessToken,
  removeTokens
} from '@/services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialProfile?: User | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialProfile }) => {
  const [user, setUser] = useState<User | null>(initialProfile || null);
  const [isLoading, setIsLoading] = useState(!initialProfile);
  const router = useRouter();

  console.log('AuthProvider initialized with:', { 
    hasInitialProfile: !!initialProfile, 
    initialProfile, 
    isLoading 
  });

  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    // If we already have initial profile data, we don't need to fetch it again
    if (initialProfile) {
      setIsLoading(false);
      return;
    }
    
    initializeAuth();
  }, [initialProfile]);

  const initializeAuth = async () => {
    try {
      const token = getAccessToken();
      if (token) {
        // Try to get profile, if successful, set user
        // If fails, the axios interceptor will handle token refresh
        const profile = await getUserProfile();
        setUser(profile as unknown as User);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Don't remove tokens here, let the axios interceptor handle it
      // This allows for automatic token refresh
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await loginWithEmail({ email });

      if (response.success) {
        toast.success(response.message || 'Verification code sent to your email!');
        // Don't set user yet, wait for OTP verification
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await registerWithEmail(data);

      if (response.success) {
        toast.success(response.message || 'Verification code sent to your email!');
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpCode = async (email: string, code: string, type: 'register' | 'login' = 'register'): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await verifyOtp({ email, code }, type);

      if (response.success && response.data) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        toast.success(type === 'register' ? 'Registration successful! Welcome!' : 'Login successful! Welcome back!');
        router.push('/');
      } else {
        throw new Error(response.message || 'Invalid verification code');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Verification failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuthentication = async (token: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await googleAuth({ googleToken: token });

      if (response.success && response.data) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        toast.success('Google authentication successful!');
        router.push('/');
      } else {
        throw new Error(response.message || 'Google authentication failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Google authentication failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      setUser(null);
      removeTokens();
      toast.success('Logged out successfully');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const updatedProfile = await updateUserProfile(data);
      setUser(updatedProfile as unknown as User);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    // This is handled automatically by the axios interceptor
    // but we can expose it for manual refresh if needed
    try {
      const profile = await getUserProfile();
      setUser(profile as unknown as User);
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      removeTokens();
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyOtp: verifyOtpCode,
    googleAuth: googleAuthentication,
    logout,
    updateProfile,
    refreshToken,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
