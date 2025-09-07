import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { axiosClient } from "@/lib/axios";
import { validateCoupon, CouponValidationResponse } from "@/services";

export interface CartItemCustomization {
  questionId: string;
  answerId?: string;
  textValue?: string;
  imagePublicId?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  quantity: number;
  maxQuantity?: number;
  customizations?: CartItemCustomization[];
  customizationCost?: number; // Total additional cost from customizations
  questions?: any[]; // Store product questions for editing
}

export interface DeliveryOption {
  id?: string; // Optional since API doesn't provide ID
  name: string;
  cost: number;
  description?: string;
  estimatedDays?: number;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  description?: string;
}

export interface Cart {
  id?: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number; // Price before coupon and delivery
  deliveryType: "company" | "home";
  selectedDeliveryOption?: DeliveryOption;
  deliveryCost: number;
  deliveryAddress?: string;
  appliedCoupon?: AppliedCoupon;
  couponDiscount: number;
  updatedAt: string;
}

interface CartStore {
  // State
  cart: Cart;
  isLoading: boolean;
  isLoggedIn: boolean;
  isInitialized: boolean;
  deliveryOptions: DeliveryOption[];
  couponStatus: {
    isValidating: boolean;
    error?: string;
    lastValidated?: string;
  };

  // Actions
  setLoggedIn: (loggedIn: boolean) => void;
  addToCart: (
    product: Omit<CartItem, "quantity">,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  updateItemCustomizations: (
    productId: string,
    customizations: CartItemCustomization[],
    customizationCost: number
  ) => Promise<void>;
  setDeliveryType: (type: "company" | "home") => void;
  setDeliveryOption: (option: DeliveryOption) => void;
  setDeliveryAddress: (address: string) => void;
  fetchDeliveryOptions: () => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;

  // Coupon actions
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Helpers
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  calculateTotals: () => void;
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  subtotal: 0,
  deliveryType: "company",
  deliveryCost: 0,
  couponDiscount: 0,
  updatedAt: new Date().toISOString(),
};

// Helper to check if user is logged in (has access token)
const isUserLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return document.cookie.includes("accessToken=");
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,
      isLoading: false,
      isLoggedIn: false,
      isInitialized: false,
      deliveryOptions: [],
      couponStatus: {
        isValidating: false,
      },

      setLoggedIn: (loggedIn: boolean) => {
        set({ isLoggedIn: loggedIn });
        if (loggedIn) {
          // Sync local cart with backend when user logs in
          get().syncWithBackend();
        }
      },

      calculateTotals: () => {
        const { cart } = get();
        const totalItems = cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const subtotal = cart.items.reduce((sum, item) => {
          const basePrice = item.salePrice || item.price;
          const customizationCost = item.customizationCost || 0;
          const itemTotal = (basePrice + customizationCost) * item.quantity;
          return sum + itemTotal;
        }, 0);

        // Apply coupon discount
        const couponDiscount = cart.appliedCoupon?.discount || 0;
        const totalAfterDiscount = subtotal - couponDiscount;
        const totalPrice = totalAfterDiscount + cart.deliveryCost;

        set({
          cart: {
            ...cart,
            totalItems,
            subtotal,
            couponDiscount,
            totalPrice: Math.max(0, totalPrice), // Ensure total is never negative
            updatedAt: new Date().toISOString(),
          },
        });
      },

      getItemQuantity: (productId: string) => {
        const item = get().cart.items.find(
          (item) => item.productId === productId
        );
        return item?.quantity || 0;
      },

      isInCart: (productId: string) => {
        return get().cart.items.some((item) => item.productId === productId);
      },

      updateItemCustomizations: async (
        productId: string,
        customizations: CartItemCustomization[],
        customizationCost: number
      ) => {
        set({ isLoading: true });

        try {
          const { cart, isLoggedIn } = get();
          const newItems = cart.items.map((item) =>
            item.productId === productId
              ? { ...item, customizations, customizationCost }
              : item
          );

          set({
            cart: {
              ...cart,
              items: newItems,
            },
          });

          // Calculate totals
          get().calculateTotals();

          // Sync with backend if logged in
          if (isLoggedIn && isUserLoggedIn()) {
            const item = cart.items.find((i) => i.productId === productId);
            if (item && item.id) {
              await axiosClient.put(`/carts/items/${item.id}`, {
                customizations: customizations,
              });
            }
          }
        } catch (error) {
          console.error("Failed to update customizations:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      setDeliveryType: (type: "company" | "home") => {
        const { cart } = get();
        const deliveryCost =
          type === "company" ? 0 : cart.selectedDeliveryOption?.cost || 0;

        set({
          cart: {
            ...cart,
            deliveryType: type,
            deliveryCost,
            selectedDeliveryOption:
              type === "company" ? undefined : cart.selectedDeliveryOption,
          },
        });

        get().calculateTotals();
      },

      setDeliveryOption: (option: DeliveryOption) => {
        const { cart } = get();

        set({
          cart: {
            ...cart,
            selectedDeliveryOption: option,
            deliveryCost: cart.deliveryType === "home" ? option.cost : 0,
          },
        });

        get().calculateTotals();
      },

      setDeliveryAddress: (address: string) => {
        const { cart } = get();

        set({
          cart: {
            ...cart,
            deliveryAddress: address,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      fetchDeliveryOptions: async () => {
        try {
          const response = await axiosClient.get("settings/delivery");
          const deliveryOptionsData = response.data.data?.deliveryCosts || [];

          // Transform API response to match our interface
          const deliveryOptions: DeliveryOption[] = deliveryOptionsData.map(
            (option: any, index: number) => ({
              id: `delivery-${index}`, // Generate ID since API doesn't provide one
              name: option.name,
              cost: option.cost,
              description: option.description,
              estimatedDays: option.estimatedDays,
            })
          );

          console.log("Delivery options:", deliveryOptions);
          set({ deliveryOptions });
        } catch (error) {
          console.error("Failed to fetch delivery options:", error);
          set({ deliveryOptions: [] });
        }
      },

      addToCart: async (product: Omit<CartItem, "quantity">, quantity = 1) => {
        set({ isLoading: true });

        try {
          const { cart, isLoggedIn } = get();
          const existingItem = cart.items.find(
            (item) => item.productId === product.productId
          );

          let newItems: CartItem[];

          if (existingItem) {
            // Update existing item quantity
            newItems = cart.items.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              ...product,
              quantity,
            };
            newItems = [...cart.items, newItem];
          }

          // Update local state
          set({
            cart: {
              ...cart,
              items: newItems,
            },
          });

          // Calculate totals
          get().calculateTotals();

          // Sync with backend if logged in
          if (isLoggedIn && isUserLoggedIn()) {
            await axiosClient.post("/carts/items", {
              productId: product.productId,
              quantity: quantity,
              customizations: product.customizations || [],
            });
          }
        } catch (error) {
          console.error("Failed to add to cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          return get().removeFromCart(productId);
        }

        set({ isLoading: true });

        try {
          const { cart, isLoggedIn } = get();
          const existingItem = cart.items.find(
            (item) => item.productId === productId
          );

          if (!existingItem) return;

          // Update local state
          const newItems = cart.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );

          set({
            cart: {
              ...cart,
              items: newItems,
            },
          });

          // Calculate totals
          get().calculateTotals();

          // Sync with backend if logged in
          if (isLoggedIn && isUserLoggedIn()) {
            await axiosClient.put(`/carts/items/${existingItem.id}`, {
              quantity: quantity,
            });
          }
        } catch (error) {
          console.error("Failed to update cart item:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (productId: string) => {
        set({ isLoading: true });

        try {
          const { cart, isLoggedIn } = get();
          const existingItem = cart.items.find(
            (item) => item.productId === productId
          );

          if (!existingItem) return;

          // Update local state
          const newItems = cart.items.filter(
            (item) => item.productId !== productId
          );

          set({
            cart: {
              ...cart,
              items: newItems,
            },
          });

          // Calculate totals
          get().calculateTotals();

          // Sync with backend if logged in
          if (isLoggedIn && isUserLoggedIn() && existingItem.id) {
            await axiosClient.delete(`/carts/items/${existingItem.id}`);
          }
        } catch (error) {
          console.error("Failed to remove from cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });

        try {
          const { isLoggedIn } = get();

          // Clear local state
          set({
            cart: initialCart,
          });

          // Sync with backend if logged in
          if (isLoggedIn && isUserLoggedIn()) {
            await axiosClient.delete("/carts");
          }
        } catch (error) {
          console.error("Failed to clear cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      syncWithBackend: async () => {
        if (!isUserLoggedIn()) return;

        set({ isLoading: true });

        try {
          // Get backend cart
          const response = await axiosClient.get("/carts");
          const backendCart = response.data.data;

          if (backendCart && backendCart.items) {
            // Map backend cart items to our format
            const backendItems: CartItem[] = backendCart.items.map(
              (item: any) => ({
                id: item.id,
                productId: item.product.id,
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                salePrice: item.product.salePrice,
                imageUrl: item.product.imageUrl,
                quantity: item.quantity,
                maxQuantity: item.product.maxQuantity,
              })
            );

            // Merge with local cart (backend takes precedence)
            const { cart: localCart } = get();
            const mergedItems: CartItem[] = [...backendItems];

            // Add local items that don't exist in backend
            localCart.items.forEach((localItem) => {
              const existsInBackend = backendItems.some(
                (backendItem) => backendItem.productId === localItem.productId
              );

              if (!existsInBackend) {
                // Add local item to backend
                axiosClient
                  .post("/carts/items", {
                    productId: localItem.productId,
                    quantity: localItem.quantity,
                  })
                  .catch(console.error);

                mergedItems.push(localItem);
              }
            });

            // Update local state with merged cart
            set({
              cart: {
                id: backendCart.id,
                items: mergedItems,
                totalItems: 0,
                totalPrice: 0,
                deliveryType: get().cart.deliveryType,
                deliveryCost: get().cart.deliveryCost,
                selectedDeliveryOption: get().cart.selectedDeliveryOption,
                updatedAt: backendCart.updatedAt || new Date().toISOString(),
              },
            });

            // Calculate totals
            get().calculateTotals();
          }
        } catch (error) {
          console.error("Failed to sync with backend:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      applyCoupon: async (code: string) => {
        set({ 
          couponStatus: { 
            isValidating: true,
            error: undefined 
          } 
        });

        try {
          const { cart } = get();
          const orderTotal = cart.subtotal; // Use subtotal before coupon

          const response = await validateCoupon(code, orderTotal);

          if (response.isValid && response.coupon) {
            const appliedCoupon: AppliedCoupon = {
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

            // Recalculate totals
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

        // Recalculate totals
        get().calculateTotals();
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        // Don't persist loading states or logged in status
      }),
    }
  )
);

// Initialize store when module loads
if (typeof window !== "undefined") {
  // Check if user is logged in and sync
  const store = useCartStore.getState();
  const loggedIn = isUserLoggedIn();

  if (loggedIn !== store.isLoggedIn) {
    store.setLoggedIn(loggedIn);
  }
  
  // Mark as initialized after a short delay to allow for hydration
  setTimeout(() => {
    useCartStore.setState({ isInitialized: true });
  }, 100);
}
