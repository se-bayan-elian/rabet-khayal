"use client"

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useProductReviewsQuery, Review } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  StarIcon,
  Filter,
  ThumbsUp,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProductReviewsProps {
  productId: string;
  onAddReview?: () => void;
  canAddReview?: boolean;
}

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const starSize = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3 h-3";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`${starSize} ${star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
            }`}
        />
      ))}
    </div>
  );
};

const RatingDistribution = ({
  distribution,
  total,
  onRatingFilter
}: {
  distribution: Record<string, number>;
  total: number;
  onRatingFilter: (rating?: number) => void;
}) => {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating.toString()] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <button
            key={rating}
            onClick={() => onRatingFilter(rating)}
            className="w-full flex items-center gap-2 text-sm hover:bg-gray-50 rounded p-1 transition-colors"
          >
            <span className="font-medium">{rating}</span>
            <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-gray-600 min-w-[2rem] text-right">{count}</span>
          </button>
        );
      })}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const t = useTranslations("reviews");

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="border-l-4 border-l-brand-gold/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <Avatar className="shrink-0">
            <AvatarFallback className="bg-brand-gold/10 text-brand-navy font-semibold">
              {getInitials(review.user.firstName, review.user.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-900">
                  {review.user.firstName} {review.user.lastName}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {review.isFeatured && (
                <Badge variant="secondary" className="bg-brand-gold/10 text-brand-navy">
                  Featured
                </Badge>
              )}
            </div>

            {/* Review Content */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>

            {/* Review Actions */}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <button className="flex items-center gap-1 hover:text-brand-navy transition-colors">
                <ThumbsUp className="w-4 h-4" />
                {t("helpful")}
              </button>
              <button className="flex items-center gap-1 hover:text-brand-navy transition-colors">
                <MessageCircle className="w-4 h-4" />
                {t("reply")}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function ProductReviews({ productId, onAddReview, canAddReview = false }: ProductReviewsProps) {
  const t = useTranslations("reviews");
  const [filters, setFilters] = useState({
    rating: undefined as number | undefined,
    sort: 'newest' as 'newest' | 'oldest' | 'highest' | 'lowest',
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error, refetch } = useProductReviewsQuery(productId, filters);

  const handleRatingFilter = (rating?: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? undefined : rating,
      page: 1
    }));
  };

  const handleSortChange = (sort: 'newest' | 'oldest' | 'highest' | 'lowest') => {
    setFilters(prev => ({ ...prev, sort, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("errorLoading")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold brand-heading">{t("title")}</h3>
          {data && (
            <p className="text-gray-600 mt-1">
              {t("reviewCount", { count: data.total })}
            </p>
          )}
        </div>

        {canAddReview && onAddReview && (
          <Button onClick={onAddReview} className="btn-primary">
            <Star className="w-4 h-4 mr-2" />
            {t("writeReview")}
          </Button>
        )}
      </div>

      {/* Reviews Summary & Filters */}
      {data && data.total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-brand-navy">
                  {data.averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(data.averageRating)} size="lg" />
                <p className="text-sm text-gray-600">
                  {t("basedOn", { count: data.total })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("ratingBreakdown")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingDistribution
                distribution={data.ratingDistribution}
                total={data.total}
                onRatingFilter={handleRatingFilter}
              />
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t("filters")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("filterByRating")}
                </label>
                <Select
                  value={filters.rating?.toString() || "all"}
                  onValueChange={(value) => handleRatingFilter(value === "all" ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("allRatings")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allRatings")}</SelectItem>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-2">
                          {rating} <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("sortBy")}
                </label>
                <Select value={filters.sort} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("newest")}</SelectItem>
                    <SelectItem value="oldest">{t("oldest")}</SelectItem>
                    <SelectItem value="highest">{t("highestRated")}</SelectItem>
                    <SelectItem value="lowest">{t("lowestRated")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(filters.rating || filters.sort !== 'newest') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ rating: undefined, sort: 'newest', page: 1, limit: 10 })}
                  className="w-full"
                >
                  {t("clearFilters")}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            {/* Reviews */}
            <div className="space-y-4">
              {data.data.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("previous")}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={filters.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= data.totalPages}
                >
                  {t("next")}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          // Empty state
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t("noReviews")}</h4>
              <p className="text-gray-600 mb-4">{t("noReviewsDescription")}</p>
              {canAddReview && onAddReview && (
                <Button onClick={onAddReview} className="btn-primary">
                  <Star className="w-4 h-4 mr-2" />
                  {t("beFirst")}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
