"use client"

import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart-api";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartModal } from "@/components/cart/AddToCartModal";
import { AddToCartWithQuestionsModal } from "@/components/cart/AddToCartWithQuestionsModal";
import { useState } from "react";

export default function WishlistPage() {
  const t = useTranslations("wishlist");
  const tCart = useTranslations("cart");
  const { items, removeFromWishlist, clearWishlist, isInitialized } = useWishlistStore();
  const { addToCart, isLoading: cartLoading } = useCartStore();

  // Modal states
  const [showCartModal, setShowCartModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [cartModalProduct, setCartModalProduct] = useState<any>(null);
  const [cartModalQuantity, setCartModalQuantity] = useState(1);

  const handleMoveToCart = async (item: any) => {
    try {
      const cartItem = {
        id: item.id,
        productId: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        salePrice: item.salePrice,
        imageUrl: item.imageUrl,
        questions: item.questions || [], // Include questions if available
      };

      // Check if product has required questions
      const hasRequiredQuestions = cartItem.questions && cartItem.questions.some((q: any) => q.required);
      
      if (hasRequiredQuestions) {
        // Show questions modal
        setCartModalProduct(cartItem);
        setCartModalQuantity(1);
        setShowQuestionsModal(true);
      } else {
        // Add directly to cart
        await addToCart(cartItem, 1);
        
        // Remove from wishlist
        removeFromWishlist(item.id);

        // Show success modal
        setCartModalProduct(cartItem);
        setCartModalQuantity(1);
        setShowCartModal(true);
      }
    } catch (error) {
      console.error('Failed to move to cart:', error);
    }
  };

  const handleMoveToCartWithQuestions = async (product: any, quantity: number, customizations: any[], customizationCost: number) => {
    try {
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        salePrice: product.salePrice,
        imageUrl: product.imageUrl,
        customizations: customizations.length > 0 ? customizations : undefined,
        customizationCost: customizationCost,
        questions: product.questions,
      };

      await addToCart(cartItem, quantity);
      
      // Remove from wishlist
      removeFromWishlist(product.id);
      
      // Close questions modal and show success modal
      setShowQuestionsModal(false);
      setCartModalProduct(cartItem);
      setCartModalQuantity(quantity);
      setShowCartModal(true);
    } catch (error) {
      console.error('Failed to add to cart with customizations:', error);
    }
  };

  // Show loading state while wishlist is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="section-container section-padding px-4 md:px-6 lg:px-8">
          <div className=" mx-auto">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 animate-pulse"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className=" rounded-2xl  shadow-md bg-white dark:bg-gray-800">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-2xl animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="section-container section-padding px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <Heart className="w-12 h-12 text-pink-500 dark:text-pink-400" />
            </div>
            <h1 className="text-3xl font-bold brand-heading mb-4 text-gray-900 dark:text-white">{t("title")}</h1>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{t("empty")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{t("emptyDesc")}</p>
            <Link href="/categories">
              <Button className="btn-primary">
                <Package className="w-4 h-4 mr-2" />
                {tCart("shopNow")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="section-container section-padding px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold brand-heading mb-2 text-gray-900 dark:text-white">{t("title")}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {items.length} {items.length === 1 ? t('item') : t('items')} saved
            </p>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('clearAll')}
            </Button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const isOnSale = item.salePrice && item.salePrice < item.price;
            const finalPrice = isOnSale ? item.salePrice : item.price;

            return (
              <Card key={item.id} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 border-0 dark:border-gray-700">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Remove button */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-9 h-9 rounded-full bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 shadow-lg backdrop-blur-sm"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>

                  {/* Sale badge */}
                  {isOnSale && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 text-white font-bold px-2 py-1 text-xs">
                        {t('sale')}
                      </Badge>
                    </div>
                  )}

                  {/* Move to cart button */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      className="w-full btn-primary backdrop-blur-sm"
                      disabled={cartLoading}
                      onClick={() => handleMoveToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {cartLoading ? t("moving") : t("moveToCart")}
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1 group-hover:text-brand-navy transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-brand-navy dark:text-brand-gold">
                      ﷼{finalPrice?.toFixed(2)}
                    </span>
                    {isOnSale && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ﷼{item.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Added date */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('added')} {new Date(item.addedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        product={cartModalProduct}
        quantity={cartModalQuantity}
      />

      {/* Add to Cart with Questions Modal */}
      <AddToCartWithQuestionsModal
        isOpen={showQuestionsModal}
        onClose={() => setShowQuestionsModal(false)}
        product={cartModalProduct}
        quantity={cartModalQuantity}
        onAddToCart={handleMoveToCartWithQuestions}
      />
    </div>
  );
}
