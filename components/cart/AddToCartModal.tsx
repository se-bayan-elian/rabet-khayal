"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight, CheckCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/store/cart-api";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CartItem | null;
  quantity: number;
  totalPrice?: number; // Add total price prop for calculated price with additions
}

export function AddToCartModal({ isOpen, onClose, product, quantity, totalPrice: propTotalPrice }: AddToCartModalProps) {
  const t = useTranslations("cart");

  if (!product) return null;

  const finalPrice = product.salePrice || product.price;
  const customizationCost = product.customizationCost || 0;
  const calculatedTotal = propTotalPrice || ((finalPrice + customizationCost) * quantity);
  const isOnSale = product.salePrice && product.salePrice < product.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-0 p-0 overflow-hidden backdrop-blur-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 shadow-lg flex items-center justify-center transition-all duration-200"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Success header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 animate-bounce" style={{ animationDelay: '0.5s' }} />

          <div className="relative flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {t("modal.success")}
              </DialogTitle>
              <p className="text-white/90 text-sm" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {t("modal.addedToCart")}
              </p>
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            {/* Product image */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 shadow-lg">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                </div>
              )}

              {/* Quantity badge */}
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-brand-gold text-brand-navy font-bold text-xs px-2 py-1 shadow-lg animate-bounce">
                  {quantity}
                </Badge>
              </div>
            </div>

            {/* Product info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mb-2" style={{ fontFamily: 'Tajwal, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: product.description }}
              >
              </p>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-brand-navy dark:!text-brand-gold" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                  {finalPrice.toFixed(2)} ﷼
                </span>
                {isOnSale && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                    {product.price.toFixed(2)}
                  </span> 
                )}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 space-y-2">
            {/* Product Price */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300 font-medium" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {t("modal.productPrice")} ({quantity}x):
              </span>
              <span className="text-gray-900 dark:text-white font-semibold" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {(finalPrice * quantity).toFixed(2)} ﷼
              </span>
            </div>
            
            {/* Customization Cost */}
            {customizationCost > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300 font-medium" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                  {t("modal.customizationCost")} ({quantity}x):
                </span>
                <span className="text-brand-gold font-semibold" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                  {(customizationCost * quantity).toFixed(2)} ﷼
                </span>
              </div>
            )}
            
            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-gray-900 dark:text-white font-bold" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {t("modal.total")}:
              </span>
              <span className="text-xl font-bold text-brand-navy dark:!text-brand-gold" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {calculatedTotal.toFixed(2)} ﷼
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all duration-200"
              style={{ fontFamily: 'Tajwal, sans-serif' }}
            >
              {t("modal.continueShopping")}
            </Button>

            <Link href="/cart" className="flex-1">
              <Button
                className="w-full bg-brand-navy hover:bg-brand-navy/90 dark:bg-brand-gold dark:hover:bg-brand-gold/90 dark:text-brand-navy text-white font-semibold transition-all duration-200 shadow-lg"
                style={{ fontFamily: 'Tajwal, sans-serif' }}
                onClick={onClose}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t("modal.goToCart")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
