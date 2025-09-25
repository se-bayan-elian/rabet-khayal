import { create } from "zustand";
import Cookies from 'js-cookie';
import { axiosAuthClient, axiosClient } from "@/lib/axios";
import { validateCoupon } from "@/services";
import { useRouter } from "next/navigation";

// Types for cart data from backend API
export interface BackendCartCustomization {
  id: string;
  cartItemId: string;
  optionId: string;
  questionText: string;
  selectedAnswer?: string;
  selectedAnswerImageUrl?: string;
  selectedAnswerImagePublicId?: string;
  customerInput?: string;
  fileUrl?: string;
  filePublicId?: string;
  additionalPrice: string; // Backend returns as string
  question: {
    id: string;
    productId: string;
    questionText: string;
    type: string;
    required: boolean;
    answers: Array<{
      id: string;
      optionId: string;
      answerText: string;
      imageUrl?: string;
      imagePublicId?: string;
      extraPrice: string;
    }>;
  };
}

export interface BackendCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: string; // Backend returns as string
  customizations?: BackendCartCustomization[];
  product: {
    id: string;
    name: string;
    description: string;
    originalPrice: string; // Backend uses originalPrice, not price
    discountedPrice?: string; // Backend uses discountedPrice, not salePrice
    weight: string;
    isFeatured: boolean;
    imageUrl?: string;
    imagePublicId?: string;
    subcategoryId: string;
    averageRating?: string;
    reviewCount?: number;
    createdAt: string;
    updatedAt: string;
    subcategory?: {
      id: string;
      name: string;
      description: string;
      imageUrl?: string;
      imagePublicId?: string;
      iconUrl?: string;
      iconPublicId?: string;
      bannerImageUrl?: string;
      bannerImagePublicId?: string;
      categoryId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface BackendCart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: BackendCartItem[];
  createdAt: string;
  updatedAt: string;
}

// Frontend types for compatibility
export interface CartItemCustomization {
  questionId: string;
  questionText?: string; // Human-readable question text
  answerId?: string;
  answerText?: string; // Human-readable answer text
  textValue?: string;
  imagePublicId?: string;
  imageUrl?: string; // URL for viewing image customizations
  fileUrl?: string; // URL for viewing file customizations
  filePublicId?: string; // Public ID for file customizations
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  unitPrice?: number; // Price at the time of adding to cart
  imageUrl?: string;
  quantity: number;
  maxQuantity?: number;
  customizations?: CartItemCustomization[];
  customizationCost?: number;
  questions?: any[];
}

export interface DeliveryOption {
  id?: string;
  name: string;
  cost: number;
  description?: string;
  estimatedDays?: number;
}

export interface AppliedCoupon {
  id?: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  description?: string;
}

export interface CartState {
  id?: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  appliedCoupon?: AppliedCoupon;
  couponDiscount: number;
  deliveryType: 'company' | 'home';
  deliveryCost: number;
  selectedDeliveryOption?: DeliveryOption;
  deliveryAddress?: string;
  updatedAt: string;
}

interface CartStore {
  // State
  cart: CartState;
  isLoading: boolean;
  isInitialized: boolean;
  isLoggedIn: boolean;
  sessionId: string;
  deliveryOptions: DeliveryOption[];
  couponStatus: {
    isValidating: boolean;
    error?: string;
    lastValidated?: string;
  };

  // Actions
  initializeCart: () => Promise<void>;
  setLoggedIn: (loggedIn: boolean) => void;
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  updateItemCustomizations: (itemId: string, customizations: CartItemCustomization[], customizationCost: number) => Promise<void>;
  setDeliveryType: (type: "company" | "home") => void;
  setDeliveryOption: (option: DeliveryOption) => void;
  setDeliveryAddress: (address: string) => void;
  fetchDeliveryOptions: () => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  ensureCartSynced: () => Promise<CartState>;

  // Coupon actions
  applyCoupon: (code: string,locale:string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Helpers
  getItemQuantity: (productId: string, customizations?: CartItemCustomization[]) => number;
  isInCart: (productId: string, customizations?: CartItemCustomization[]) => boolean;
  calculateTotals: () => void;
  
  // Checkout
  createOrder: (paymentMethod: 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay', paymentId?: string) => Promise<{ success: boolean; order?: any; error?: string }>;
}

const initialCart: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  subtotal: 0,
  deliveryType: "company",
  deliveryCost: 0,
  couponDiscount: 0,
  updatedAt: new Date().toISOString(),
};

// Session storage keys
const DELIVERY_TYPE_KEY = 'cart_delivery_type';
const DELIVERY_OPTION_KEY = 'cart_delivery_option';
const DELIVERY_ADDRESS_KEY = 'cart_delivery_address';
const COUPON_KEY = 'cart_applied_coupon';

// Helper functions for session storage
const getFromSessionStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const setToSessionStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to session storage:', error);
    // Clear corrupted data
    try {
      sessionStorage.removeItem(key);
    } catch (clearError) {
      console.error('Failed to clear corrupted session storage:', clearError);
    }
  }
};

// Helper to check if user is authenticated
const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = Cookies.get('accessToken');
  const hasValidToken = !!token && token.trim() !== '';
  return hasValidToken;
};

// Helper to generate session ID
const generateSessionId = (): string => {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to get session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('cart-session-id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('cart-session-id', sessionId);
  } else {
  }
  return sessionId;
};

// Helper to get appropriate axios client based on authentication
const getAxiosClient = () => {
  const authenticated = isAuthenticated();
  const client = authenticated ? axiosAuthClient : axiosClient;
 
  return client;
};

// Helper to get session ID from store state or fallback to sessionStorage
const getCurrentSessionId = (get: any): string => {
  const currentState = get();
  
  // Priority: Store state > Session storage > Generate new
  let sessionId = currentState.sessionId;
  
  if (!sessionId) {
    sessionId = getSessionId();
  }
  
  
  return sessionId;
};

// Helper to compare customizations
const areCustomizationsEqual = (cust1?: CartItemCustomization[], cust2?: CartItemCustomization[]): boolean => {
  if (!cust1 && !cust2) return true;
  if (!cust1 || !cust2) return false;
  if (cust1.length !== cust2.length) return false;
  
  const sorted1 = [...cust1].sort((a, b) => a.questionId.localeCompare(b.questionId));
  const sorted2 = [...cust2].sort((a, b) => a.questionId.localeCompare(b.questionId));
  
  return sorted1.every((c1, index) => {
    const c2 = sorted2[index];
    return c1.questionId === c2.questionId &&
           c1.answerId === c2.answerId &&
           c1.textValue === c2.textValue &&
           c1.imagePublicId === c2.imagePublicId &&
           c1.fileUrl === c2.fileUrl &&
           c1.filePublicId === c2.filePublicId;
  });
};

// Helper to transform backend cart item to frontend format
const transformCartItem = (backendItem: BackendCartItem): CartItem => {
  return {
    id: backendItem.id,
    productId: backendItem.productId,
    name: backendItem.product.name,
    description: backendItem.product.description,
    price: parseFloat(backendItem.product.originalPrice), // Use originalPrice
    salePrice: backendItem.product.discountedPrice ? parseFloat(backendItem.product.discountedPrice) : undefined, // Use discountedPrice
    unitPrice: parseFloat(backendItem.unitPrice), // Parse string to number
    imageUrl: backendItem.product.imageUrl,
    quantity: backendItem.quantity,
    customizations: backendItem.customizations?.map(cust => {
      // Find the actual answer text from the question answers array
      const selectedAnswerObj = cust.question.answers.find(answer => answer.id === cust.selectedAnswer);
      const answerText = selectedAnswerObj?.answerText || null;
      
      // Generate image URL from public ID if available
      const imageUrl = cust.selectedAnswerImagePublicId 
        ? `https://res.cloudinary.com/nextjs-bayan/image/upload/${cust.selectedAnswerImagePublicId}`
        : cust.selectedAnswerImageUrl;
      
      // Transform customization data properly
      
      
      const result = {
        questionId: cust.optionId,
        questionText: cust.question.questionText, // Use actual question text from nested question
        answerId: cust.selectedAnswer,
        answerText: answerText || undefined, // Use actual answer text from answers array
        textValue: cust.customerInput || undefined,
        imagePublicId: cust.selectedAnswerImagePublicId || undefined,
        imageUrl: imageUrl || undefined, // Construct Cloudinary URL or use existing URL
        fileUrl: cust.fileUrl || undefined, // Add file URL
        filePublicId: cust.filePublicId || undefined, // Add file public ID
      };
      
      
      return result;
    }),
    customizationCost: backendItem.customizations?.reduce((sum, cust) => sum + parseFloat(cust.additionalPrice), 0) || 0,
  };
};

// Helper to transform frontend customizations to backend format
const transformToBackendCustomizations = (customizations: CartItemCustomization[], questions?: any[]): any[] => {
  return customizations.map(cust => {
    let additionalPrice = 0;
    let questionText = cust.questionText;
    
    // Always try to find the question text from the questions array
    if (questions) {
      const question = questions.find(q => q.id === cust.questionId);
      
      if (question) {
        questionText = question.questionText;
        
        // For select-type questions, find the answer and get additional price
        if (cust.answerId && question.answers) {
          const answer = question.answers.find((a: any) => a.id === cust.answerId);
          
          if (answer) {
            additionalPrice = parseFloat(answer.extraPrice?.toString() || '0');
          }
        }
      }
    }
    
    // Fallback if question text is still not found
    if (!questionText) {
      questionText = `Question ${cust.questionId}`;
      
    }
    
    return {
      optionId: cust.questionId,
      questionText: questionText,
      selectedAnswer: cust.answerId, // Backend expects selectedAnswer, not selectedAnswerId
      customerInput: cust.textValue,
      selectedValueImageUrl: cust.imageUrl, // Add image URL
      selectedValueImagePublicId: cust.imagePublicId, // This is correct field name
      fileUrl: cust.fileUrl, // Add file URL
      filePublicId: cust.filePublicId, // Add file public ID
      additionalPrice: additionalPrice, // Calculate from answer's extraPrice
    };
  });
};

// Helper to refresh cart data from backend
const refreshCartFromBackend = async (set: any, get: any) => {
  try {
    const headers: Record<string, string> = {};
    
    // For anonymous users, add session ID header
    if (!isAuthenticated()) {
      headers['X-Session-ID'] = getCurrentSessionId(get);
    }

    
    const response = await getAxiosClient().get('/carts', { headers });
    const backendCart: BackendCart = response.data.data || response.data;
    
    const transformedItems = backendCart.items?.map(transformCartItem) || [];
    
    // Preserve delivery and coupon info from current state
    const currentCart = get().cart;
    
    // Recalculate delivery cost based on current delivery type and selected option
    const recalculatedDeliveryCost = currentCart.deliveryType === 'home' && currentCart.selectedDeliveryOption 
      ? currentCart.selectedDeliveryOption.cost 
      : 0;
    
    
    
    set({
      cart: {
        ...currentCart,
        id: backendCart.id,
        items: transformedItems,
        deliveryCost: recalculatedDeliveryCost, // Ensure delivery cost is properly set
        updatedAt: backendCart.updatedAt,
        // Keep existing coupon - don't clear it on cart refresh
        // Coupon will be validated again during order creation
      }
    });
    
    get().calculateTotals();
  } catch (error) {
    console.error('Failed to refresh cart:', error);
  }
};

export const useCartStore = create<CartStore>()((set, get) => ({
  cart: initialCart,
  isLoading: false,
  isInitialized: false,
  isLoggedIn: false,
  sessionId: typeof window !== 'undefined' ? getSessionId() : '',
  deliveryOptions: [],
  couponStatus: {
    isValidating: false,
  },

  initializeCart: async () => {
    if (get().isInitialized) return;
    
    set({ isLoading: true });
    try {
      const isLoggedIn = isAuthenticated();
      const currentState = get();
      const sessionId = currentState.sessionId || getSessionId();
      const headers: Record<string, string> = {};
      
      // Send session ID for anonymous users OR during login for cart merging
      if (!isLoggedIn && sessionId) {
        headers['X-Session-ID'] = sessionId;
      } else if (isLoggedIn && sessionId && currentState.sessionId) {
        // Only send sessionId if we have one stored for merging (during login)
        headers['X-Session-ID'] = sessionId;
        
      }

      
    const response = await getAxiosClient().get('/carts', { headers });
      const backendCart: BackendCart = response.data.data || response.data;
      
      // Use the cart data as-is from the backend
      const finalBackendCart = backendCart;
      
      const transformedItems = finalBackendCart.items?.map(transformCartItem) || [];
      
      // Load delivery and coupon info from session storage
      const savedDeliveryType = getFromSessionStorage(DELIVERY_TYPE_KEY) || 'company';
      const savedDeliveryOption = getFromSessionStorage(DELIVERY_OPTION_KEY);
      const savedDeliveryAddress = getFromSessionStorage(DELIVERY_ADDRESS_KEY);
      const savedCoupon = getFromSessionStorage(COUPON_KEY);
      
      // Validate delivery option data integrity
      const isValidDeliveryOption = savedDeliveryOption && 
        typeof savedDeliveryOption === 'object' && 
        savedDeliveryOption.id && 
        savedDeliveryOption.name && 
        typeof savedDeliveryOption.cost === 'number' && 
        savedDeliveryOption.cost > 0;
      
      const validatedDeliveryOption = isValidDeliveryOption ? savedDeliveryOption : null;
      
      // Clear corrupted session storage data
      if (!isValidDeliveryOption && savedDeliveryOption) {
        
        sessionStorage.removeItem(DELIVERY_OPTION_KEY);
      }
      
      
      
      set({
        cart: {
          ...initialCart,
          id: finalBackendCart.id,
          items: transformedItems,
          deliveryType: savedDeliveryType,
          selectedDeliveryOption: validatedDeliveryOption,
          deliveryAddress: savedDeliveryAddress,
          appliedCoupon: savedCoupon,
          deliveryCost: savedDeliveryType === 'home' && validatedDeliveryOption ? validatedDeliveryOption.cost : 0,
          updatedAt: finalBackendCart.updatedAt,
        },
        isInitialized: true,
        isLoggedIn,
        sessionId,
      });
      
      get().calculateTotals();
    } catch (error) {
      console.error('Failed to initialize cart:', error);
      set({ 
        cart: {
          ...initialCart,
          deliveryType: getFromSessionStorage(DELIVERY_TYPE_KEY) || 'company',
          selectedDeliveryOption: getFromSessionStorage(DELIVERY_OPTION_KEY),
          deliveryAddress: getFromSessionStorage(DELIVERY_ADDRESS_KEY),
          appliedCoupon: getFromSessionStorage(COUPON_KEY),
        },
        isInitialized: true 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setLoggedIn: (loggedIn: boolean) => {
    const currentState = get();
    
    if (loggedIn && !currentState.isLoggedIn) {
      // User is logging in - keep sessionId for cart merging, then clear it after
      
      
      set({
        isLoggedIn: true,
        // Keep sessionId temporarily for cart merging
        sessionId: currentState.sessionId,
        isInitialized: false
      });
      
      // Initialize cart (this will merge anonymous cart with user cart)
      get().initializeCart().then(() => {
        // After successful initialization/merging, clear the sessionId

        set({ sessionId: '' });
      });
    } else if (!loggedIn && currentState.isLoggedIn) {
      // User is logging out - generate new sessionId for anonymous cart
      const newSessionId = getSessionId();
      
      set({
        isLoggedIn: false,
        sessionId: newSessionId,
        isInitialized: false
      });
      
      get().initializeCart();
    } else {
      // No state change needed
      set({ isLoggedIn: loggedIn });
    }
  },

  calculateTotals: () => {
    const { cart } = get();
    
    // Calculate subtotal from items
    const subtotal = cart.items.reduce((sum, item) => {
      const basePrice = item.unitPrice || item.salePrice || item.price;
      const customizationCost = item.customizationCost || 0;
      const itemTotal = (basePrice + customizationCost) * item.quantity;
      return sum + itemTotal;
    }, 0);
    
    // Calculate coupon discount
    const couponDiscount = cart.appliedCoupon?.discount || 0;
    
    // Calculate total
    const total = subtotal + cart.deliveryCost - couponDiscount;
    

    
    set({
      cart: {
        ...cart,
        subtotal,
        couponDiscount,
        totalPrice: Math.max(0, total),
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        updatedAt: new Date().toISOString(),
      }
    });
  },

  getItemQuantity: (productId: string, customizations?: CartItemCustomization[]) => {
    const { cart } = get();
    const item = cart.items.find(
      (item) => item.productId === productId && 
               areCustomizationsEqual(item.customizations, customizations)
    );
    return item?.quantity || 0;
  },

  isInCart: (productId: string, customizations?: CartItemCustomization[]) => {
    const { cart } = get();
    return cart.items.some((item) => 
      item.productId === productId && 
      areCustomizationsEqual(item.customizations, customizations)
    );
  },

  addToCart: async (product: Omit<CartItem, "quantity">, quantity = 1) => {
    set({ isLoading: true });
    try {
      const headers: Record<string, string> = {};
      
      // For anonymous users only, add session ID header
      // Authenticated users are identified by JWT token in Authorization header
      if (!isAuthenticated()) {
        const sessionId = getCurrentSessionId(get);
        headers['X-Session-ID'] = sessionId;
      
      }
      
      const backendCustomizations = product.customizations 
        ? transformToBackendCustomizations(product.customizations, product.questions)
        : [];

      // Debug: Log backend customizations being sent
      console.log('Backend customizations being sent:', backendCustomizations);

      await getAxiosClient().post('/carts/items', {
        productId: product.productId,
        quantity,
        unitPrice: product.salePrice || product.price,
        customizations: backendCustomizations,
      }, { headers });

      // Refresh cart from backend without reinitializing
      await refreshCartFromBackend(set, get);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return get().removeFromCart(itemId);
    }

    set({ isLoading: true });
    try {
      const headers: Record<string, string> = {};
      
      // For anonymous users only, add session ID header
      // Authenticated users are identified by JWT token in Authorization header
      if (!isAuthenticated()) {
        const sessionId = getCurrentSessionId(get);
        headers['X-Session-ID'] = sessionId;
      
      }
      
      await getAxiosClient().put(`/carts/items/${itemId}`, { quantity }, { headers });
      
      // Refresh cart from backend without reinitializing
      await refreshCartFromBackend(set, get);
    } catch (error) {
      console.error("Failed to update cart item:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (itemId: string) => {
    set({ isLoading: true });
    try {
      const headers: Record<string, string> = {};
      
      // For anonymous users only, add session ID header
      // Authenticated users are identified by JWT token in Authorization header
      if (!isAuthenticated()) {
        const sessionId = getCurrentSessionId(get);
        headers['X-Session-ID'] = sessionId;
      
      }
      
      await getAxiosClient().delete(`/carts/items/${itemId}`, { headers });
      
      // Refresh cart from backend without reinitializing
      await refreshCartFromBackend(set, get);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateItemCustomizations: async (
    itemId: string,
    customizations: CartItemCustomization[],
    customizationCost: number
  ) => {
    set({ isLoading: true });
    try {
      const { cart } = get();
      const item = cart.items.find(i => i.id === itemId);
      
      if (item) {
        const headers: Record<string, string> = {};
        
        // For anonymous users, add session ID header
        if (!isAuthenticated()) {
          headers['X-Session-ID'] = getCurrentSessionId(get);
        }
        
        // Remove the item
        await getAxiosClient().delete(`/carts/items/${itemId}`, { headers });
        
        // Add it back with new customizations
        const backendCustomizations = transformToBackendCustomizations(customizations);
        await getAxiosClient().post('/carts/items', {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.salePrice || item.price,
          customizations: backendCustomizations,
        }, { headers });
        
        // Refresh cart from backend without reinitializing
        await refreshCartFromBackend(set, get);
      }
    } catch (error) {
      console.error("Failed to update customizations:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setDeliveryType: (type: "company" | "home") => {
    const { cart } = get();
    
    // If switching to home and we already have a selected option, preserve the cost
    // If switching to company, set cost to 0
    let deliveryCost = 0;
    if (type === "home" && cart.selectedDeliveryOption) {
      deliveryCost = cart.selectedDeliveryOption.cost;
    } else if (type === "home" && !cart.selectedDeliveryOption) {
      // If switching to home but no option selected, keep current cost if it exists
      deliveryCost = cart.deliveryCost || 0;
    }

   

    const updatedCart = {
      ...cart,
      deliveryType: type,
      deliveryCost,
      selectedDeliveryOption: type === "company" ? undefined : cart.selectedDeliveryOption,
    };

    set({ cart: updatedCart });
    
    // Save to session storage
    setToSessionStorage(DELIVERY_TYPE_KEY, type);
    if (type === "company") {
      sessionStorage.removeItem(DELIVERY_OPTION_KEY);
    }

    get().calculateTotals();
  },

  setDeliveryOption: (option: DeliveryOption) => {
    const { cart } = get();
    const deliveryCost = cart.deliveryType === "home" ? option.cost : 0;
    
   
    
    const updatedCart = {
      ...cart,
      selectedDeliveryOption: option,
      deliveryCost,
    };
    
    set({ cart: updatedCart });
    
    // Save to session storage
    setToSessionStorage(DELIVERY_OPTION_KEY, option);
    
   
    
    get().calculateTotals();
  },

  setDeliveryAddress: (address: string) => {
    const { cart } = get();
    const updatedCart = {
      ...cart,
      deliveryAddress: address,
      updatedAt: new Date().toISOString(),
    };
    
    set({ cart: updatedCart });
    
    // Save to session storage
    setToSessionStorage(DELIVERY_ADDRESS_KEY, address);
  },

  fetchDeliveryOptions: async () => {
    try {
      const response = await axiosClient.get("settings/delivery");
      const deliveryOptionsData = response.data.data?.deliveryCosts || [];

      const deliveryOptions: DeliveryOption[] = deliveryOptionsData.map(
        (option: any, index: number) => ({
          id: `delivery-${index}`,
          name: option.name,
          cost: option.cost,
          description: option.description,
          estimatedDays: option.estimatedDays,
        })
      );

      set({ deliveryOptions });
    } catch (error) {
      console.error("Failed to fetch delivery options:", error);
      set({ deliveryOptions: [] });
    }
  },

  clearCart: async () => {
   
    set({ isLoading: true });
    try {
      const headers: Record<string, string> = {};
      
      // For anonymous users only, add session ID header
      // Authenticated users are identified by JWT token in Authorization header
      if (!isAuthenticated()) {
        const sessionId = getCurrentSessionId(get);
        headers['X-Session-ID'] = sessionId;

      }
      
      await getAxiosClient().delete("/carts", { headers });
      
      // Clear coupon when cart is cleared
      sessionStorage.removeItem(COUPON_KEY);
      
      set({ cart: { ...initialCart, 
        deliveryType: get().cart.deliveryType,
        selectedDeliveryOption: get().cart.selectedDeliveryOption,
        deliveryAddress: get().cart.deliveryAddress,
        // Don't preserve coupon when cart is cleared
        appliedCoupon: undefined,
        couponDiscount: 0,
      }});
      
      // Reset coupon status
      set({
        couponStatus: {
          isValidating: false,
          error: undefined,
          lastValidated: undefined,
        }
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  syncWithBackend: async () => {
    await get().initializeCart();
  },

  ensureCartSynced: async () => {
    const { cart } = get();
    

    
    if (!cart.id) {

      await get().initializeCart();
    }

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cannot create order from empty cart');
    }

    if (!cart.id) {
      throw new Error('Cart synchronization failed');
    }

 

    return cart;
  },

  applyCoupon: async (code: string, locale: string) => {
    // Check if user is authenticated
    if (!get().isLoggedIn) {
      set({ 
        couponStatus: { 
          isValidating: false,
          error: 'cart.errors.authenticationRequired' 
        } 
      });
      return { success: false, message: 'cart.errors.authenticationRequired' };
    }

    set({ 
      couponStatus: { 
        isValidating: true,
        error: undefined 
      } 
    });

    try {
      const { cart } = get();
      const orderTotal = cart.subtotal;

      const response = await validateCoupon(code, orderTotal, locale);
   

      if (response.isValid && response.coupon) {
        const appliedCoupon: AppliedCoupon = {
          id: response.coupon.id,
          code: response.coupon.code,
          discount: response.discount,
          discountType: response.coupon.discountType,
          description: response.coupon.description,
        };
        
   

        set({
          cart: {
            ...cart,
            appliedCoupon,
          },
          couponStatus: {
            isValidating: false,
            lastValidated: code,
          },
        });

        // Save to session storage

        setToSessionStorage(COUPON_KEY, appliedCoupon);
        
        // Verify it was saved
        const savedCoupon = getFromSessionStorage(COUPON_KEY);
  

        get().calculateTotals();

        return {
          success: true,
          message: response.message || 'Coupon applied successfully!'
        };
      } else {
        set({
          couponStatus: {
            isValidating: false,
            error: response.message || 'Invalid coupon code',
          },
        });

        return {
          success: false,
          message: response.message || 'Invalid coupon code'
        };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to validate coupon';
      
      set({
        couponStatus: {
          isValidating: false,
          error: errorMessage,
        },
      });

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  removeCoupon: () => {
    const { cart } = get();
    
    set({
      cart: {
        ...cart,
        appliedCoupon: undefined,
      },
      couponStatus: {
        isValidating: false,
        error: undefined,
        lastValidated: undefined,
      },
    });

    // Remove from session storage
    sessionStorage.removeItem(COUPON_KEY);

    get().calculateTotals();
  },


  createOrder: async (paymentMethod: 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay', paymentId?: string) => {
    if (!isAuthenticated()) {
      throw new Error('User must be authenticated to create an order');
    }

    set({ isLoading: true });
    try {
      // Ensure cart is synced
      const syncedCart = await get().ensureCartSynced();

      // Get coupon ID if coupon is applied
      const couponId = syncedCart.appliedCoupon?.id;
     

      // Get current locale from cookies or default to 'ar'
      const locale = typeof window !== 'undefined' 
        ? (document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] || 'ar')
        : 'ar';

      // Create order from cart
      const orderRequestData = {
        cartId: syncedCart.id,
        paymentMethod,
        googleAddress: syncedCart.deliveryAddress || 'Company Pickup',
        deliveryEnabled: syncedCart.deliveryType === 'home',
        deliveryFee: syncedCart.deliveryCost || 0,
        tax: 0,
        couponId, // Include coupon ID if available
        locale, // Add locale for i18n support
        paymentId, // Include payment ID if provided
      };
      

      
      const response = await axiosAuthClient.post('/orders', orderRequestData);

      const order = response.data.data;

      // Clear cart after successful order creation

      await get().clearCart();
      
      // Clear session storage
      
      sessionStorage.removeItem(DELIVERY_TYPE_KEY);
      sessionStorage.removeItem(DELIVERY_OPTION_KEY);
      sessionStorage.removeItem(DELIVERY_ADDRESS_KEY);
      sessionStorage.removeItem(COUPON_KEY);

      return {
        success: true,
        order: order,
        orderId: order.id
      };
    } catch (error) {
      console.error('Failed to create order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
        order: null,
        orderId: null
      };
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Initialize cart when module loads
if (typeof window !== "undefined") {
  const store = useCartStore.getState();
  
  // Initialize cart after a short delay to allow for hydration
  setTimeout(() => {
    store.initializeCart();
  }, 100);
}
