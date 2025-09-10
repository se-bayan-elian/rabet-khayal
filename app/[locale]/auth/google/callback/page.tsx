"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the tokens from URL parameters (backend should redirect with these)
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          toast.error('Google authentication failed');
          return;
        }

        if (accessToken && refreshToken) {
          // Set tokens in cookies
          document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}`;

          // Fetch user profile
          const response = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const profile = await response.json();
            setUser(profile.data);
            setStatus('success');
            setMessage('Successfully signed in with Google!');
            toast.success('Welcome! You have been signed in successfully.');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
              router.push('/');
            }, 2000);
          } else {
            throw new Error('Failed to fetch user profile');
          }
        } else {
          throw new Error('No authentication tokens received');
        }
      } catch (error: any) {
        console.error('Google callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed. Please try again.');
        toast.error('Google authentication failed');
        
        // Redirect to login page after error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, setUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Signing you in...'}
            {status === 'success' && 'Welcome!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />
              <p className="text-gray-600">Please wait while we complete your sign-in...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">Redirecting you to the home page...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-600" />
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">Redirecting you to the login page...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
