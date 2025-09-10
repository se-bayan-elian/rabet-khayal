# Route Protection System

This document explains the route protection system implemented in the middleware and utility functions.

## Overview

The route protection system automatically handles authentication-based redirects:
- **Protected routes**: Require authentication, redirect to login if not authenticated
- **Auth routes**: Redirect to home if user is already authenticated
- **Public routes**: No authentication required

## Middleware Protection

The middleware (`middleware.ts`) automatically handles route protection at the server level:

### Protected Routes
These routes require authentication:
- `/my-profile` - User profile page
- `/my-orders` - User orders page
- `/wishlist` - User wishlist
- `/settings` - User settings
- `/checkout` - Checkout process
- `/cart` - Shopping cart

### Auth Routes
These routes redirect authenticated users to home:
- `/login` - Login page
- `/register` - Registration page
- `/verify-otp` - OTP verification page

### Public Routes
These routes are accessible to everyone:
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/services` - Services page
- `/products` - Products page
- `/categories` - Categories page
- `/reviews` - Reviews page
- `/terms` - Terms and conditions
- `/privacy` - Privacy policy

## How It Works

### Authentication Check
The middleware checks for both `accessToken` and `refreshToken` cookies:
```typescript
function hasValidTokens(request: NextRequest): boolean {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  return !!(accessToken && refreshToken);
}
```

### Redirect Logic
1. **Protected Route + Not Authenticated** → Redirect to `/login`
2. **Auth Route + Authenticated** → Redirect to `/` (home)
3. **Public Route** → Allow access regardless of auth status

### Internationalization Support
All redirects respect the current locale:
- `/en/my-profile` → `/en/login` (if not authenticated)
- `/ar/my-profile` → `/ar/login` (if not authenticated)

## Client-Side Utilities

### Route Utils (`lib/route-utils.ts`)
Utility functions for route checking:

```typescript
import { isProtectedRoute, isAuthRoute, shouldRedirect } from '@/lib/route-utils';

// Check if route requires authentication
const needsAuth = isProtectedRoute('/my-profile'); // true

// Check if route is auth-related
const isAuth = isAuthRoute('/login'); // true

// Get redirect path based on auth status
const { shouldRedirect, redirectTo } = shouldRedirect('/my-profile', false);
// shouldRedirect: true, redirectTo: '/login'
```

### React Hooks (`hooks/use-route-protection.ts`)
Client-side hooks for route protection:

```typescript
import { useRouteProtection, useRequiresAuth, useIsAuthRoute } from '@/hooks/use-route-protection';

function MyComponent() {
  // Automatically handles redirects based on current route and auth status
  const { isAuthenticated, isLoading } = useRouteProtection();
  
  // Check if current route requires authentication
  const requiresAuth = useRequiresAuth();
  
  // Check if current route is an auth route
  const isAuth = useIsAuthRoute();
  
  return (
    <div>
      {requiresAuth && !isAuthenticated && <div>Please log in</div>}
      {isAuth && isAuthenticated && <div>Already logged in</div>}
    </div>
  );
}
```

## Usage Examples

### 1. Protecting a Page Component
```typescript
// pages/my-profile/page.tsx
import { useRouteProtection } from '@/hooks/use-route-protection';

export default function MyProfilePage() {
  // This will automatically redirect to login if not authenticated
  useRouteProtection();
  
  return <div>Profile content</div>;
}
```

### 2. Conditional Rendering Based on Route
```typescript
import { useRequiresAuth } from '@/hooks/use-route-protection';

function Navigation() {
  const requiresAuth = useRequiresAuth();
  
  return (
    <nav>
      {requiresAuth && <div>Protected content</div>}
    </nav>
  );
}
```

### 3. Manual Route Checking
```typescript
import { isProtectedRoute, getRedirectPath } from '@/lib/route-utils';

function handleNavigation(pathname: string, isAuthenticated: boolean) {
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const redirectTo = getRedirectPath(pathname, isAuthenticated, 'en');
    router.push(redirectTo);
  }
}
```

## Adding New Routes

### To add a new protected route:
1. Add the route to `PROTECTED_ROUTES` in `middleware.ts`
2. Add the route to `PROTECTED_ROUTES` in `lib/route-utils.ts`
3. Update the `useRequiresAuth` hook in `hooks/use-route-protection.ts`

### To add a new auth route:
1. Add the route to `AUTH_ROUTES` in `middleware.ts`
2. Add the route to `AUTH_ROUTES` in `lib/route-utils.ts`
3. Update the `useIsAuthRoute` hook in `hooks/use-route-protection.ts`

## Testing

The route protection can be tested by:
1. **Not logged in**: Try accessing `/my-profile` → Should redirect to `/login`
2. **Logged in**: Try accessing `/login` → Should redirect to `/`
3. **Public routes**: Should be accessible regardless of auth status

## Notes

- The middleware runs on every request, so it's very fast
- Client-side hooks provide additional flexibility for components
- All redirects preserve the current locale
- The system is designed to work with the existing authentication context
