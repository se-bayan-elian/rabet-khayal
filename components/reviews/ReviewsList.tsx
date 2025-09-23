"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, ThumbsUp, MoreHorizontal, User } from 'lucide-react'
import { useProductReviewsQuery, type Review, type ReviewsResponse } from '@/services'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ReviewsListProps {
  productId: string
  initialReviews?: Review[]
}

const ReviewsList = ({ productId, initialReviews }: ReviewsListProps) => {
  const t = useTranslations('reviews')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')
  const [filterRating, setFilterRating] = useState<number | undefined>()

  const { 
    data: reviewsData, 
    isLoading, 
    isError 
  } = useProductReviewsQuery(productId, {
    sort: sortBy,
    rating: filterRating,
    page: 1,
    limit: 10
  })

  const reviews = reviewsData?.data?.data || []
  const averageRating: number = reviewsData?.data?.averageRating || 0
  const totalReviews: number = reviewsData?.data?.total || 0


  const renderStars = (rating: number, size = 'sm') => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400 dark:fill-amber-400 dark:text-amber-400' : 'text-gray-300 dark:text-gray-500'
            }`}
          />
        ))}
      </div>
    )
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full bg-gray-200 dark:bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <AlertDescription className="text-red-700 dark:text-red-300">
          {t('errorLoading')}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-navy dark:!text-amber-300">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(averageRating, 'lg')}
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('basedOnReviews', { count: totalReviews })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'highest' | 'lowest')}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="newest">{t('sortBy.newest')}</option>
            <option value="oldest">{t('sortBy.oldest')}</option>
            <option value="highest">{t('sortBy.highest')}</option>
            <option value="lowest">{t('sortBy.lowest')}</option>
          </select>

          <select 
            value={filterRating || ''} 
            onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{t('allRatings')}</option>
            <option value="5">5 {t('stars')}</option>
            <option value="4">4 {t('stars')}</option>
            <option value="3">3 {t('stars')}</option>
            <option value="2">2 {t('stars')}</option>
            <option value="1">1 {t('star')}</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="p-8 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Star className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{t('noReviews')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('noReviewsDescription')}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-700">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm dark:text-white">
                        {review.user?.firstName} {review.user?.lastName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.isFeatured && (
                      <Badge variant="secondary" className="text-xs bg-brand-gold/10 text-brand-navy dark:bg-amber-400/10 dark:text-amber-400">
                        {t('featured')}
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {review.title && (
                  <h4 className="font-semibold mb-2 dark:text-white">{review.title}</h4>
                )}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {review.content}
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <ThumbsUp className="w-4 h-4" />
                    {t('helpful')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewsList
