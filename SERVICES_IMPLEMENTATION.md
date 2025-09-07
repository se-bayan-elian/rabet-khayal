# Services Cycle Implementation

## Overview

This document outlines the complete implementation of the services cycle for the Rabet Al-Khayal website, including all features from service listing to contact form integration.

## Features Implemented

### 1. Services Popover in Navbar ✅

- **Location**: `components/header.tsx`
- **Features**:
  - Dynamic services list from API
  - Icon-based service display
  - Responsive design for mobile/desktop
  - Fallback to static services if API fails
  - Smooth hover animations

### 2. Services Page ✅

- **Location**: `app/[locale]/services/page.tsx`
- **Features**:
  - Grid layout with service cards
  - Pagination support
  - Search functionality
  - Loading skeletons
  - Error states
  - Empty states
  - Responsive design (1-3 columns based on screen size)

### 3. Service Detail Page ✅

- **Location**: `app/[locale]/services/[serviceId]/page.tsx`
- **Features**:
  - Hero section with service image and description
  - Two-tab layout:
    - **Details Tab**: Service info + pricing plans
    - **Projects Tab**: Portfolio showcase
  - Pricing plans with features comparison
  - Popular plan highlighting
  - Request service button
  - Responsive design with mobile optimization

### 4. Project Detail Page ✅

- **Location**: `app/[locale]/services/projects/[projectId]/page.tsx`
- **Features**:
  - Project hero section
  - Image gallery with modal viewer
  - Navigation between gallery images
  - Project metadata (client, completion date, etc.)
  - External project link
  - Related service link
  - Responsive gallery grid

### 5. Contact Form Integration ✅

- **Location**: `app/[locale]/contact/page.tsx`
- **Features**:
  - Service pre-selection via URL params
  - Pricing plan selection dropdown
  - Form validation
  - Success modal
  - Contact information sidebar
  - Working hours display
  - Responsive layout

### 6. Responsive Design & States ✅

- **Loading States**: Skeleton components for all pages
- **Error States**: User-friendly error messages with retry options
- **Empty States**: Informative messages when no data is available
- **Mobile Optimization**: All components work seamlessly on mobile devices
- **Dark/Light Mode**: CSS variables support theme switching

### 7. Localization Support ✅

- **Translation Keys**: Complete Arabic and English translations
- **RTL Support**: Right-to-left layout support
- **Dynamic Content**: API content displayed in selected language

## File Structure

```
frontend/
├── app/[locale]/
│   ├── services/
│   │   ├── page.tsx                    # Services listing page
│   │   ├── [serviceId]/
│   │   │   └── page.tsx                # Service detail page
│   │   └── projects/
│   │       └── [projectId]/
│   │           └── page.tsx            # Project detail page
│   └── contact/
│       └── page.tsx                    # Contact form page
├── components/
│   ├── services/
│   │   ├── ServiceCard.tsx             # Service card component
│   │   ├── ServiceCardSkeleton.tsx     # Loading skeleton
│   │   ├── ServiceErrorCard.tsx        # Error state component
│   │   ├── EmptyServiceCard.tsx        # Empty state component
│   │   ├── ServiceHeroSection.tsx      # Hero section component
│   │   ├── ProjectCard.tsx             # Project card component
│   │   └── PricingPlanCard.tsx         # Pricing plan component
│   └── header.tsx                      # Updated with services popover
├── services/
│   └── services.ts                     # API functions
├── types/
│   └── services.ts                     # TypeScript type definitions
└── messages/
    ├── en.json                         # English translations (updated)
    └── ar.json                         # Arabic translations (updated)
```

## API Integration

### Endpoints Used

- `GET /services` - List all services with pagination
- `GET /services/:id` - Get service details
- `GET /services/:id/projects` - Get service projects
- `GET /services/:id/pricing-plans` - Get service pricing plans
- `GET /services/projects/:id` - Get project details
- `POST /contact` - Submit contact form

### Type Definitions

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  projectCount: number;
  isActive: boolean;
  displayOrder: number;
  projects?: Project[];
  pricingPlans?: PricingPlan[];
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  mainImageUrl?: string;
  gallery?: { url: string; public_id: string }[];
  projectUrl?: string;
  clientName?: string;
  completionDate?: string;
  service?: Service;
}

interface PricingPlan {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  originalPrice: number;
  finalPrice: number;
  billingPeriod: string;
  deliveryDays?: number;
  revisions?: number;
  isPopular: boolean;
  isActive: boolean;
  features?: Feature[];
}
```

## Navigation Flow

1. **Services Discovery**:

   - Header popover → Services page
   - Homepage services section → Services page

2. **Service Exploration**:

   - Services page → Service detail page
   - Service detail → Project detail
   - Service detail → Contact form (with pre-filled service)

3. **Contact Integration**:
   - Any service page → Contact form with service pre-selected
   - Pricing plan selection → Contact form with plan pre-selected
   - Success modal → Confirmation and next steps

## Key Features

### URL Parameters

- **Contact Form**: Supports `?serviceId=xxx&pricingPlanId=yyy` for pre-filling
- **Services Page**: Supports pagination `?page=1&limit=10`

### Responsive Breakpoints

- **Mobile**: 1 column layout
- **Tablet**: 2 column layout
- **Desktop**: 3 column layout

### Loading & Error Handling

- **React Query**: Automatic caching, refetching, and error handling
- **Graceful Degradation**: Fallbacks for missing images and data
- **User Feedback**: Loading spinners, error messages, and success notifications

### Accessibility

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: High contrast ratios for readability

## Usage Examples

### Linking to Services

```tsx
// Link to services page
<Link href="/services">View Services</Link>

// Link to specific service
<Link href="/services/web-development-id">Web Development</Link>

// Link to contact with service pre-selected
<Link href="/contact?serviceId=web-development-id">Request Web Development</Link>
```

### Using Components

```tsx
// Service card with API data
<ServiceCard service={serviceData} />

// Loading state
<ServiceCardSkeleton />

// Error state
<ServiceErrorCard error={error} onRetry={refetch} />
```

## Translation Keys

### Service Detail Keys

- `services.detail.notFound`
- `services.detail.requestService`
- `services.detail.tabs.details`
- `services.detail.tabs.projects`
- `services.detail.pricingPlans`
- `services.detail.popular`
- `services.detail.selectPlan`

### Contact Form Keys

- `contact.title`
- `contact.form.name`
- `contact.form.selectService`
- `contact.success.title`

## Customization

### Theming

The implementation uses CSS variables for theming:

- `--brand-navy`: Primary brand color
- `--brand-gold`: Accent color
- `--brand-bg`: Background color

### Styling

Components use Tailwind CSS with custom brand classes:

- `.brand-heading`: Branded heading styles
- `.btn-primary`: Primary button styles
- `.section-padding`: Consistent section spacing

## Performance Optimizations

1. **React Query Caching**: 5-minute stale time for API calls
2. **Image Optimization**: Next.js Image component with lazy loading
3. **Code Splitting**: Dynamic imports for large components
4. **Skeleton Loading**: Immediate visual feedback during data loading

## Testing Recommendations

1. **API Integration**: Test with real backend data
2. **Responsive Design**: Test on various screen sizes
3. **Error Scenarios**: Test network failures and empty states
4. **Form Submission**: Test contact form with various inputs
5. **Navigation**: Test all routing scenarios
6. **Localization**: Test Arabic and English content

## Future Enhancements

1. **Search & Filtering**: Add service search and category filtering
2. **Reviews & Ratings**: Add service reviews and ratings
3. **Bookmarking**: Allow users to save favorite services
4. **Service Comparison**: Side-by-side service comparison
5. **Social Sharing**: Share services on social media
6. **Analytics**: Track service engagement metrics

## Deployment Notes

1. Ensure all translation keys are properly merged
2. Verify API endpoints are correctly configured
3. Test image loading from CDN/Cloudinary
4. Confirm responsive design on various devices
5. Validate form submission and success flows
