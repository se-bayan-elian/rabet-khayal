/**
 * Route utilities for authentication and navigation
 */

// Define protected routes that require authentication
export const PROTECTED_ROUTES = [
  '/my-profile',
  '/my-orders',
  '/wishlist',
  '/settings',
  '/checkout',
  '/cart'
] as const;

// Define auth routes that should redirect if user is already logged in
export const AUTH_ROUTES = [
  '/login',
  '/register',
  '/verify-otp'
] as const;

// Define public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/products',
  '/categories',
  '/reviews',
  '/terms',
  '/privacy'
] as const;

export type ProtectedRoute = typeof PROTECTED_ROUTES[number];
export type AuthRoute = typeof AUTH_ROUTES[number];
export type PublicRoute = typeof PUBLIC_ROUTES[number];

/**
 * Check if a route is protected (requires authentication)
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => {
    if (route === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(route);
  });
}

/**
 * Check if a route is an auth route (login, register, etc.)
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if a route is public (no authentication required)
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(route);
  });
}

/**
 * Get the appropriate redirect path based on authentication status
 */
export function getRedirectPath(
  pathname: string, 
  isAuthenticated: boolean, 
  locale: string = 'en'
): string | null {
  const localizedPath = (path: string) => {
    if (path === '/') {
      return `/${locale}`;
    }
    return `/${locale}${path}`;
  };

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return localizedPath('/login');
  }

  // If accessing auth route with auth, redirect to home
  if (isAuthRoute(pathname) && isAuthenticated) {
    return localizedPath('/');
  }

  // No redirect needed
  return null;
}

/**
 * Check if user should be redirected based on current route and auth status
 */
export function shouldRedirect(
  pathname: string,
  isAuthenticated: boolean
): { shouldRedirect: boolean; redirectTo: string | null } {
  const redirectTo = getRedirectPath(pathname, isAuthenticated);
  return {
    shouldRedirect: redirectTo !== null,
    redirectTo
  };
}
