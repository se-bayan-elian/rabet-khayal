import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/my-profile',
  '/my-orders',
  '/wishlist',
  '/settings',
  '/checkout',
  '/cart'
];

// Define auth routes that should redirect if user is already logged in
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/verify-otp'
];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/products',
  '/categories',
  '/reviews',
  '/terms',
  '/privacy'
];

// Function to check if user has valid tokens
function hasValidTokens(request: NextRequest): boolean {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // User is considered authenticated if they have both tokens
  return !!(accessToken && refreshToken);
}

// Function to check if route matches pattern
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(route);
  });
}

// Function to get locale from pathname
function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const locale = segments[1];
  return ['ar', 'en'].includes(locale) ? locale : 'en';
}

// Function to create localized path
function createLocalizedPath(path: string, locale: string): string {
  if (path === '/') {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
}

// Main middleware function
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') ||
    pathname.startsWith('/trpc')
  ) {
    return NextResponse.next();
  }

  // Extract locale and clean pathname
  const locale = getLocaleFromPathname(pathname);
  const cleanPathname = pathname.replace(`/${locale}`, '') || '/';
  
  const isAuthenticated = hasValidTokens(request);
  
  // Handle protected routes
  if (matchesRoute(cleanPathname, PROTECTED_ROUTES)) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      const loginUrl = createLocalizedPath('/login', locale);
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
  }
  
  // Handle auth routes
  if (matchesRoute(cleanPathname, AUTH_ROUTES)) {
    if (isAuthenticated) {
      // Redirect to home if already authenticated
      const homeUrl = createLocalizedPath('/', locale);
      return NextResponse.redirect(new URL(homeUrl, request.url));
    }
  }
  
  // Apply next-intl middleware for internationalization
  return createMiddleware(routing)(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
