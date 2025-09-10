"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Star,
  ShoppingCart,
  ArrowRight,
  Eye,
  Heart
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useFeaturedProductsQuery, ProductItem as APIProductItem } from '@/services'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { AddToCartModal } from "@/components/cart/AddToCartModal"

interface CreativeProductsProps {
  title: string
  subtitle: string
}

export function CreativeProducts({ title, subtitle }: CreativeProductsProps) {
  const t = useTranslations('products')
  const tCart = useTranslations('cart')
  const tStock = useTranslations('productDetails.stock')
  const { data: featuredProducts, isLoading, error } = useFeaturedProductsQuery(6)
  const { addToCart, isLoading: cartLoading } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()

  // Modal states
  const [showCartModal, setShowCartModal] = useState(false)
  const [cartModalProduct, setCartModalProduct] = useState<any>(null)
  const [cartModalQuantity, setCartModalQuantity] = useState(1)

  console.log(error)
  const handleAddToCart = async (product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean }, quantity = 1) => {
    try {
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        description: product.description || product.subcategory?.description || "",
        price: parseFloat(product.originalPrice),
        salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
        imageUrl: product.imageUrl || undefined,
      }

      await addToCart(cartItem, quantity)

      // Show success modal
      setCartModalProduct(cartItem)
      setCartModalQuantity(quantity)
      setShowCartModal(true)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleWishlistToggle = (product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean }) => {
    const wishlistItem = {
      id: product.id,
      name: product.name,
      description: product.description || product.subcategory?.description || "",
      price: parseFloat(product.originalPrice),
      salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
      imageUrl: product.imageUrl || undefined,
      addedAt: new Date().toISOString(),
    }
    toggleWishlist(wishlistItem)
  }

  // Transform products to add computed properties
  const rawProducts = featuredProducts || []
  const products: (APIProductItem & { price: number; salePrice?: number; isInStock: boolean })[] = rawProducts.map((product: APIProductItem) => ({
    ...product,
    price: parseFloat(product.originalPrice),
    salePrice: product.discountedPrice ? parseFloat(product.discountedPrice) : undefined,
    isInStock: product.isAvailable !== false && (product.stock === undefined || product.stock > 0),
  }))

  // Product Card Component (from subcategory page)
  const ProductCard = ({ product }: { product: APIProductItem & { price: number; salePrice?: number; isInStock: boolean } }) => {
    const price = parseFloat(product.originalPrice);
    const salePrice = product.discountedPrice ? parseFloat(product.discountedPrice) : undefined;
    const isOnSale = salePrice && salePrice < price;
    const finalPrice = isOnSale ? salePrice! : price;
    const isWishlisted = isInWishlist(product.id);

    return (
      <Card className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 border-0 dark:border-gray-700">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              variant="secondary"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              onClick={() => handleWishlistToggle(product)}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </Button>
            <Link href={`/products/${product.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </Button>
            </Link>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isOnSale && (
              <Badge className="bg-red-500 text-white font-bold px-2 py-1 text-xs">
                {t("sale")}
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-brand-gold text-brand-navy font-bold px-2 py-1 text-xs">
                {t("featured")}
              </Badge>
            )}
            {!product.isInStock && (
              <Badge variant="secondary" className="bg-gray-500 text-white font-bold px-2 py-1 text-xs">
                {t("outOfStock")}
              </Badge>
            )}
          </div>

          {/* Quick add to cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              className="w-full btn-primary backdrop-blur-sm"
              disabled={!product.isInStock || cartLoading}
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {cartLoading ? "Adding..." : tCart("addToCart")}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-3">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-navy transition-colors cursor-pointer hover:underline">
                {product.name}
              </h3>
            </Link>
            {product.description ? (
              <div
                className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                {product.subcategory?.description || product.name}
              </p>
            )}
          </div>

          {/* Product Features */}
          <div className="flex flex-wrap gap-1">
            {product.isFeatured && (
              <Badge variant="secondary" className="bg-brand-gold/10 text-brand-navy text-xs">
                {t("featured")}
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand-navy">
              ${finalPrice?.toFixed(2)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 line-through">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs font-medium ${product.isInStock ? 'text-green-700' : 'text-red-700'}`}>
              {product.isInStock ? tStock("inStock") : tStock("outOfStock")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="section-padding bg-white dark:bg-gray-900">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="!p-0 overflow-hidden border-0 shadow-lg">
                <Skeleton className="w-full h-64" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Failed to load featured products</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/categories">
            <Button className="btn-creative px-8 py-4 text-lg font-bold">
              <ArrowRight className="w-5 h-5 ml-2" />
              {t('viewAll', { default: 'View All Products' })}
            </Button>
          </Link>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        product={cartModalProduct}
        quantity={cartModalQuantity}
      />
    </section>
  )
}
