"use client"

import { useCategoryQuery, useSubcategoriesQuery, SubcategoryItem } from "@/services";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronRight, AlertCircle, RefreshCw, Home, Package, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const locale = params.locale as string;
  
  const tCommon = useTranslations("common");
  const tCategory = useTranslations("categoryDetailPage");
  
  const { data: category, isLoading: categoryLoading, error: categoryError, refetch: refetchCategory } = useCategoryQuery(categoryId);
  const { data: subcategoriesData, isLoading: subcategoriesLoading, error: subcategoriesError, refetch: refetchSubcategories } = useSubcategoriesQuery(
    categoryId,
    { pagination: { page: 1, limit: 100 } }
  );

  const subcategories = subcategoriesData?.data || [];
  const isLoading = categoryLoading || subcategoriesLoading;
  const error = categoryError || subcategoriesError;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="section-container section-padding py-8 md:py-12">
          {/* Breadcrumb skeleton */}
          <div className="mb-6">
            <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Category header skeleton */}
          <div className="mb-10">
            <Skeleton className="h-64 md:h-80 w-full rounded-2xl bg-gray-200 dark:bg-gray-700 mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-96 mx-auto bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Subcategories skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="w-full h-64 rounded-2xl bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="section-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{tCategory("error.title")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{tCategory("error.message")}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => { refetchCategory(); refetchSubcategories(); }} className="bg-brand-navy hover:bg-brand-navy-light dark:bg-amber-600 dark:hover:bg-amber-700 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                {tCategory("error.retry")}
              </Button>
              <Button onClick={() => router.back()} variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {tCommon("back")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="section-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{tCategory("notFound.title")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{tCategory("notFound.message")}</p>
            <Link href={`/${locale}/categories`}>
              <Button className="bg-brand-navy hover:bg-brand-navy-light dark:bg-amber-600 dark:hover:bg-amber-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                {tCategory("notFound.goToCategories")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty subcategories state
  const hasSubcategories = subcategories && subcategories.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
      <div className="section-container section-padding px-4 md:px-6 lg:px-8">
        {/* Category Header */}
        <div className="mb-12">
          {/* Category Image Banner */}
          <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-2xl mb-8">
            {category.imageUrl ? (
              <>
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-navy to-brand-navy/80 dark:from-gray-800 dark:to-gray-900" />
            )}
            
            {/* Icon overlay */}
            {category.iconUrl && (
              <div className="absolute top-6 left-6 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/95 dark:bg-gray-800/95 p-3 shadow-lg backdrop-blur-sm">
                <Image
                  src={category.iconUrl}
                  alt={`${category.name} icon`}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-4 sm:p-6 md:p-8">
                <div className="section-container">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Breadcrumb */}
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-3 overflow-hidden">
                        <Link href={`/${locale}`} className="hover:text-white transition-colors shrink-0 hover:underline">
                          {tCategory("breadcrumb.home")}
                        </Link>
                        <ChevronRight className="w-4 h-4 shrink-0 text-white/60" />
                        <Link href={`/${locale}/categories`} className="hover:text-white transition-colors shrink-0 hover:underline">
                          {tCategory("breadcrumb.categories")}
                        </Link>
                        <ChevronRight className="w-4 h-4 shrink-0 text-white/60" />
                        <span className="text-white font-medium truncate">{category.name}</span>
                      </div>

                      {/* Badge
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/90 dark:bg-amber-400/90 text-brand-navy dark:text-gray-900 mb-3">
                        {tCategory("badge")}
                      </div> */}

                      {/* Title */}
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 break-words">
                        {category.name}
                      </h1>

                      {/* Subcategory count */}
                      {hasSubcategories && (
                        <p className="text-white/90 text-base sm:text-lg">
                          {subcategories.length} {tCategory("subcategoriesCount")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Description */}
          {category.description && (
            <div className="max-w-3xl mx-auto text-center mb-8">
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                {category.description}
              </p>
            </div>
          )}
        </div>

        {/* Subcategories Section */}
        <div>
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {tCategory("subcategoriesTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {tCategory("subcategoriesSubtitle")}
            </p>
          </div>

          {hasSubcategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subcategories.map((sub: SubcategoryItem) => (
                <Link 
                  key={sub.id} 
                  href={`/${locale}/categories/${categoryId}/sub/${sub.id}`}
                  className="group block"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out group-hover:shadow-2xl group-hover:-translate-y-2 bg-white dark:bg-gray-800">
                    {/* Subcategory Image */}
                    <div className="relative w-full h-56 md:h-64">
                      {sub.imageUrl ? (
                        <Image
                          src={sub.imageUrl}
                          alt={sub.name}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
                      
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-brand-gold/90 dark:bg-amber-400/90 text-brand-navy dark:text-gray-900">
                          {tCategory("subcategoryBadge")}
                        </span>
                      </div>
                    </div>

                    {/* Subcategory Info */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <div className="text-white text-lg md:text-xl font-bold leading-tight mb-2">
                        {sub.name}
                      </div>
                      <div className="text-xs text-white/90 flex items-center gap-1 group-hover:gap-2 transition-all">
                        <span>{tCategory("explore")}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {tCategory("empty.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {tCategory("empty.message")}
              </p>
              <Link href={`/${locale}/categories`}>
                <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {tCategory("empty.backToCategories")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

