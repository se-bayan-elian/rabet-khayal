export interface LoginRequest {
  email: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // Required in backend
}

export interface VerifyOtpRequest {
  email: string;
  code: string; // Backend uses 'code' not 'otp'
}

export interface GoogleAuthRequest {
  googleToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // Backend uses phoneNumber
  avatar?: string;
  address?: string;
  googleId?: string;
  isVerified: boolean; // Backend uses isVerified not isEmailVerified
  isActive: boolean;
  role: "customer" | "admin" | "super_admin"; // Backend uses 'customer' not 'user'
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    language: "en" | "ar";
    currency: "USD" | "SAR";
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string; // Backend uses phoneNumber
  address?: string; // Backend uses simple string address
  avatar?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  total: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    imageUrl?: string;
    originalPrice: string;
    discountedPrice?: string;
  };
  quantity: number;
  price: number;
  customizations?: Record<string, any>;
}

export interface Address {
  id?: string;
  type: "shipping" | "billing";
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// AuthContextType removed - using React Query pattern instead
