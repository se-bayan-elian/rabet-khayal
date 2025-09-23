"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthActions } from '@/lib/auth-actions';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { setAccessToken } from '@/services/auth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const t = useTranslations('auth.google');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    
    let isMounted = true;
    hasProcessed.current = true;

    const handleCallback = async () => {
      try {
        // Check for success/error status from backend redirect
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (error) {
          if (isMounted) {
            setStatus('error');
            setMessage(t('googleAuthFailed'));
            toast.error(t('googleAuthFailed'));
          }
          
          // Redirect to login page after error
          setTimeout(() => {
            if (isMounted) {
              router.push('/login');
            }
          }, 3000);
          return;
        }

        if (success === 'true') {
          // Get access token from URL parameters
          const accessToken = searchParams.get('accessToken');
          
          if (accessToken) {
            // Set the access token in cookies
            setAccessToken(accessToken);
            
            // Invalidate all queries to refresh the app state
            await queryClient.invalidateQueries();
            
            if (isMounted) {
              setStatus('success');
              setMessage(t('googleAuthSuccess'));
              toast.success(t('welcomeMessage'));
            }
            
            // Redirect to home page after a short delay
            setTimeout(() => {
              if (isMounted) {
                router.push('/');
              }
            }, 2000);
          } else {
            throw new Error('Access token not received from backend');
          }
        } else {
          // No success parameter, something went wrong
          throw new Error('Authentication process incomplete');
        }
      } catch (error: any) {
        console.error('Google callback error:', error);
        if (isMounted) {
          setStatus('error');
          setMessage(error.message || t('authFailed'));
          toast.error(t('googleAuthFailed'));
        }
        
        // Redirect to login page after error
        setTimeout(() => {
          if (isMounted) {
            router.push('/login');
          }
        }, 3000);
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to run once

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && t('signingIn')}
            {status === 'success' && t('welcome')}
            {status === 'error' && t('authFailed')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />
              <p className="text-gray-600">{t('pleaseWait')}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">{t('redirectingHome')}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-600" />
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">{t('redirectingLogin')}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
