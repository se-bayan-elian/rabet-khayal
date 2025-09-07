"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Star,
  Quote,
  ArrowLeft,
  ArrowRight,
  User
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useFeaturedReviewsQuery } from '@/services'

interface TestimonialsProps {
  title?: string
  subtitle?: string
}

export function Testimonials({ title, subtitle }: TestimonialsProps) {
  const t = useTranslations('testimonials')
  const { data: featuredReviews, isLoading, error } = useFeaturedReviewsQuery()

  if (isLoading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-4 h-4 mr-1" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="section-container">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Failed to load testimonials</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!featuredReviews || featuredReviews.length === 0) {
    return null // Don't render section if no testimonials
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--brand-navy)' }}>
            {title || t('title', { default: 'What Our Clients Say' })}
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--brand-text-secondary)' }}>
            {subtitle || t('subtitle', { default: 'Real testimonials from our satisfied customers' })}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredReviews?.slice(0, 6).map((review, index) => (
            <Card key={review.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-brand-gold" />
                </div>

                {/* Review Title */}
                {review.title && (
                  <h4 className="font-semibold text-lg mb-3 text-gray-900">
                    {review.title}
                  </h4>
                )}

                {/* Review Content */}
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">
                  {review.content}
                </p>

                {/* Rating */}
                <div className="mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-brand-navy" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('verifiedCustomer', { default: 'Verified Customer' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        {featuredReviews.length > 6 && (
          <div className="text-center">
            <Link href="/reviews">
              <Button className="btn-primary px-8 py-4 text-lg font-bold">
                <ArrowRight className="w-5 h-5 mr-2" />
                {t('viewAllReviews', { default: 'View All Reviews' })}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
