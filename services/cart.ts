import { axiosClient } from "@/lib/axios";

// Cart interfaces
export interface CartCustomization {
  optionId: string;
  questionText: string;
  selectedAnswer?: string;
  selectedValueImageUrl?: string;
  selectedValueImagePublicId?: string;
  customerInput?: string;
  additionalPrice: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  customizations?: CartCustomization[];
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    price: number;
    salePrice?: number;
  };
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  customizations?: CartCustomization[];
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Cart API functions
export const cartApi = {
  // Get cart (works for both authenticated and anonymous users)
  getCart: async (sessionId?: string): Promise<Cart> => {
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
    
    const response = await axiosClient.get<{ data: Cart }>('/carts', { headers });
    return response.data.data;
  },

  // Add item to cart
  addToCart: async (data: AddToCartRequest, sessionId?: string): Promise<Cart> => {
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
    
    const response = await axiosClient.post<{ data: Cart }>('/carts/items', data, { headers });
    return response.data.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, data: UpdateCartItemRequest, sessionId?: string): Promise<Cart> => {
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
    
    const response = await axiosClient.put<{ data: Cart }>(`/carts/items/${itemId}`, data, { headers });
    return response.data.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: string, sessionId?: string): Promise<Cart> => {
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
    
    const response = await axiosClient.delete<{ data: Cart }>(`/carts/items/${itemId}`, { headers });
    return response.data.data;
  },

  // Clear entire cart
  clearCart: async (sessionId?: string): Promise<void> => {
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
    
    await axiosClient.delete('/carts', { headers });
  },

  // Note: Cart association and price fixing are handled automatically by the backend
};

// Helper function to generate session ID
export const generateSessionId = (): string => {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to get session ID from localStorage
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('cart-session-id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('cart-session-id', sessionId);
  }
  return sessionId;
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.cookie.includes('accessToken=');
};
