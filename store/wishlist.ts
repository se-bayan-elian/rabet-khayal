import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  questions?: any[];
  addedAt: string;
}

interface WishlistStore {
  // State
  items: WishlistItem[];
  isInitialized: boolean;

  // Actions
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: WishlistItem) => void;
  clearWishlist: () => void;

  // Helpers
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isInitialized: false,

      addToWishlist: (product: WishlistItem) => {
        const { items } = get();
        const exists = items.some((item) => item.id === product.id);

        if (!exists) {
          set({
            items: [
              ...items,
              { ...product, addedAt: new Date().toISOString() },
            ],
          });
        }
      },

      removeFromWishlist: (productId: string) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== productId),
        });
      },

      toggleWishlist: (product: WishlistItem) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();

        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
        } else {
          addToWishlist(product);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      getWishlistCount: () => {
        const { items } = get();
        return items.length;
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        // Don't persist isInitialized
      }),
    }
  )
);

// Initialize store when module loads
if (typeof window !== "undefined") {
  // Mark as initialized after a short delay to allow for hydration
  setTimeout(() => {
    useWishlistStore.setState({ isInitialized: true });
  }, 100);
}
