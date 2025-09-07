"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Star, Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { createReview, CreateReviewData } from '@/services'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review is too long'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface AddReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  isAuthenticated: boolean
  onAuthRequired: () => void
}

const AddReviewModal = ({ 
  isOpen, 
  onClose, 
  productId, 
  isAuthenticated, 
  onAuthRequired 
}: AddReviewModalProps) => {
  const t = useTranslations('reviews.add')
  const tCommon = useTranslations('common')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const queryClient = useQueryClient()

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      content: '',
    }
  })

  const currentRating = watch('rating')

  const addReviewMutation = useMutation({
    mutationFn: (data: CreateReviewData) => createReview(data),
    onSuccess: () => {
      setShowSuccess(true)
      reset()
      // Invalidate reviews queries to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 2000)
    },
  })

  const handleStarClick = (rating: number) => {
    setValue('rating', rating, { shouldValidate: true })
  }

  const onSubmit = (data: ReviewFormData) => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }

    addReviewMutation.mutate({
      productId,
      ...data,
    })
  }

  const handleClose = () => {
    if (!addReviewMutation.isPending && !showSuccess) {
      reset()
      setHoveredRating(0)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="brand-heading">
            {showSuccess ? t('successTitle') : t('title')}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">{t('successMessage')}</h3>
            <p className="text-gray-600">{t('successDescription')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Authentication Warning */}
            {!isAuthenticated && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('authRequired')}
                </AlertDescription>
              </Alert>
            )}

            {/* Rating */}
            <div>
              <Label htmlFor="rating">{t('rating')} *</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-colors hover:scale-110"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || currentRating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">{t('reviewTitle')} *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder={t('titlePlaceholder')}
                className="mt-2"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">{t('reviewContent')} *</Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder={t('contentPlaceholder')}
                rows={4}
                className="mt-2"
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>

            {/* Error Display */}
            {addReviewMutation.isError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('submitError')}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={addReviewMutation.isPending}
                className="flex-1"
              >
                {tCommon('cancel')}
              </Button>
              <Button 
                type="submit" 
                className="btn-primary flex-1" 
                disabled={addReviewMutation.isPending || !isAuthenticated}
              >
                {addReviewMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('submitReview')}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddReviewModal
