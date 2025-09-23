"use client";

import { useState, useEffect } from 'react';
import { initializeGoogleAuth, triggerGoogleAuth } from '@/lib/google-auth';
import { toast } from 'sonner';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Google Auth when component mounts
    const initAuth = async () => {
      try {
        await initializeGoogleAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
        toast.error('Failed to initialize Google authentication');
      }
    };

    initAuth();
  }, []);

  const signInWithGoogle = async (sessionId?: string) => {
    if (!isInitialized) {
      toast.error('Google authentication is not ready yet');
      return;
    }

    setIsLoading(true);
    try {
      // Redirect to Google OAuth URL with sessionId for cart migration
      await triggerGoogleAuth(sessionId);
      // Note: User will be redirected, so we don't need to handle success here
    } catch (error: any) {
      console.error('Google authentication error:', error);
      toast.error(error.message || 'Google authentication failed');
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
    isInitialized,
  };
};