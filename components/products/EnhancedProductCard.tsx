"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Star, Eye, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductItem } from '@/services'
import { useWishlistStore } from '@/store/wishlist'
import { AddToCartWithQuestionsModal } from '@/components/cart/AddToCartWithQuestionsModal'
import { useCartStore } from '@/store/cart-api'

interface EnhancedProductCardProps {
  product: ProductItem
  showQuickActions?: boolean
}

const EnhancedProductCard = ({ product, showQuickActions = true }: EnhancedProductCardProps) => {
  const t = useTranslations('products')
  const [showCustomizationModal, setShowCustomizationModal] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addToCart)

  const isInWishlist = wishlistItems.some(item => item.id === product.id)
  const hasQuestions = product.questions && product.questions.length > 0
  const averageRating = product.averageRating || 0
  const reviewCount = product.reviewCount || 0

  const handleWishlistToggle = async () => {
    setIsAddingToWishlist(true)
    try {
      if (isInWishlist) {
        removeFromWishlist(product.id)
      } else {
        addToWishlist({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: Number(product.discountedPrice || product.originalPrice),
          imageUrl: product.imageUrl || '',
          salePrice: product.discountedPrice ? Number(product.discountedPrice) : undefined,
        })
      }
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const handleAddToCart = () => {
    setShowCustomizationModal(true)
  }

  const handleAddToCartWithQuestions = (product: any, quantity: number, customizations: any[], customizationCost: number) => {
    // Add to cart with customizations
    addToCart({
      id: product.id, // Cart item ID
      productId: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price, // ✅ FIX: Use product's base price
      salePrice: product.salePrice, // ✅ FIX: Include sale price if available
      imageUrl: product.imageUrl || '',
      customizations: customizations.length > 0 ? customizations : undefined,
      customizationCost: customizationCost, // ✅ FIX: Use the customization cost directly
      questions: product.questions, // ✅ FIX: Include questions for editing
    }, quantity)
    setShowCustomizationModal(false)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatPrice = (price: string | number) => {
    return `﷼${Number(price).toFixed(2)}`
  }

  const discountPercentage = product.discountedPrice 
    ? Math.round(((Number(product.originalPrice) - Number(product.discountedPrice)) / Number(product.originalPrice)) * 100)
    : 0

  return (
    <>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-square">
              <Image
                src={product.imageUrl || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Quick Actions */}
              {showQuickActions && (
                <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                    onClick={handleWishlistToggle}
                    disabled={isAddingToWishlist}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Link href={`/products/${product.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 space-y-1">
                {product.isFeatured && (
                  <Badge className="bg-yellow-500 text-white">
                    {t('featured')}
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">
                    {t('sale')} -{discountPercentage}%
                  </Badge>
                )}
                {!product.isInStock && (
                  <Badge variant="secondary">
                    {t('outOfStock')}
                  </Badge>
                )}
              </div>
            </div>
          </Link>

          {/* Product Info */}
          <CardContent className="p-4">
            {/* Category */}
            {product.subcategory && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.subcategory.name}</p>
            )}

            {/* Product Name */}
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
                {product.name}
              </h3>
            </Link>

            {/* Reviews */}
            <div className="flex items-center gap-2 mb-3">
              {renderStars(averageRating)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {reviewCount > 0 
                  ? `${averageRating.toFixed(1)} (${reviewCount})`
                  : t('noReviews')
                }
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.discountedPrice || product.originalPrice)}
              </span>
              {product.discountedPrice && (
                <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div 
                className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 html-content"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button 
                onClick={handleAddToCart}
                className="w-full btn-primary"
                disabled={!product.isInStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.isInStock ? t('addToCart') : t('outOfStock')}
              </Button>
              
              {reviewCount > 0 && (
                <Link href={`/products/${product.id}#reviews`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('viewReviews', { count: reviewCount })}
                  </Button>
                </Link>
              )}
            </div>

            {/* Weight Info */}
            {product.weight && (
              <div className="text-xs text-gray-500 mt-2">
                {t('weight')}: {product.weight}
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Add to Cart with Questions Modal */}
      {showCustomizationModal && (
        <AddToCartWithQuestionsModal
          isOpen={showCustomizationModal}
          onClose={() => setShowCustomizationModal(false)}
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.discountedPrice || product.originalPrice),
            salePrice: product.discountedPrice ? Number(product.discountedPrice) : undefined,
            imageUrl: product.imageUrl || undefined,
            questions: product.questions
          }}
          quantity={1}
          onAddToCart={handleAddToCartWithQuestions}
        />
      )}
    </>
  )
}

export default EnhancedProductCard
