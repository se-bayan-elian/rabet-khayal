"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-profile';
import { shouldRedirect } from '@/lib/route-utils';

/**
 * Hook for client-side route protection
 * Automatically redirects users based on authentication status and current route
 */
export function useRouteProtection() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Extract clean pathname (remove locale)
    const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    
    const { shouldRedirect: needsRedirect, redirectTo } = shouldRedirect(
      cleanPathname,
      isAuthenticated
    );

    if (needsRedirect && redirectTo) {
      router.push(redirectTo);
    }
  }, [pathname, isAuthenticated, isLoading, router]);

  return {
    isAuthenticated,
    isLoading,
    pathname
  };
}

/**
 * Hook to check if current route requires authentication
 */
export function useRequiresAuth(): boolean {
  const pathname = usePathname();
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  
  return cleanPathname.startsWith('/my-profile') ||
         cleanPathname.startsWith('/my-orders') ||
         cleanPathname.startsWith('/wishlist') ||
         cleanPathname.startsWith('/settings') ||
         cleanPathname.startsWith('/checkout') ||
         cleanPathname.startsWith('/cart');
}

/**
 * Hook to check if current route is an auth route
 */
export function useIsAuthRoute(): boolean {
  const pathname = usePathname();
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  
  return cleanPathname.startsWith('/login') ||
         cleanPathname.startsWith('/register') ||
         cleanPathname.startsWith('/verify-otp');
}
