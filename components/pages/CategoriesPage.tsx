 "use client"

import { CategoryItem, SubcategoryItem, useCategoriesQuery } from "@/services";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, AlertCircle, RefreshCw, Home } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CategoriesPage() {
  const tLinks = useTranslations("footer.links");
  const tCat = useTranslations("categoriesPage");
  const { data: categories = [], isLoading, error, refetch } = useCategoriesQuery({ pagination: { page: 1, limit: 20 } });
  const typedCategories = categories as unknown as CategoryItem[];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="section-container section-padding">
          <div className="mb-14 text-center">
            <Skeleton className="h-6 w-24 mx-auto mb-3 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-10 w-64 mx-auto mb-2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-96 mx-auto bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="space-y-16">
            {[1, 2, 3].map((idx) => (
              <section key={idx} className="space-y-8">
                <Skeleton className="w-full h-44 sm:h-56 md:h-64 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-full h-56 md:h-64 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
              </section>
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
            <h2 className="text-2xl font-bold mb-4 brand-heading dark:text-white">{tCat("error.title")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{tCat("error.message")}</p>
            <Button onClick={() => refetch()} className="btn-primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              {tCat("error.retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!typedCategories.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="section-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-brand-gold/20 dark:bg-amber-400/20">
              <Home className="w-8 h-8 text-brand-navy dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 brand-heading dark:text-white">{tCat("empty.title")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{tCat("empty.message")}</p>
            <Link href="/">
              <Button className="btn-primary">
                <Home className="w-4 h-4 mr-2" />
                {tCat("empty.goHome")}
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
        <div className="mb-14 text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wide bg-brand-gold/20 text-brand-navy dark:bg-amber-400/20 dark:!text-amber-400">
            {tLinks("products")}
          </span>
          <h1 className="text-section-title brand-heading mt-3 dark:text-amber-100">{tCat("heading")}</h1>
          <p className="mt-2 text-sm md:text-base max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            {tCat("subtitle")}
          </p>
        </div>

        <div className="space-y-20">
          {typedCategories.map((cat, idx) => (
            <section key={cat.id} className="space-y-8">
              {/* Clean Category banner */}
              <div className="relative w-full h-40 sm:h-48 md:h-52 rounded-xl overflow-hidden shadow-lg group">
                {cat.imageUrl ? (
                  <>
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-brand-navy to-brand-navy/80 dark:from-gray-900 dark:to-gray-800" />
                )}

                {/* Simple content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {cat.name}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {(cat.subcategories as SubcategoryItem[] | undefined || []).length} {tCat("subcategory")}
                      </p>
                    </div>

                    {cat.iconUrl && (
                      <div className="w-12 h-12 rounded-lg bg-white/90 dark:bg-gray-800/90 p-2 shadow-md">
                        <Image
                          src={cat.iconUrl}
                          alt={`${cat.name} icon`}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Subcategories carousel (full-bleed within container) */}
              <div className="-mx-4 md:-mx-6 lg:-mx-8">
                <Carousel className="w-full">
                  <CarouselContent className="px-4 md:px-6 lg:px-8">
                    {(cat.subcategories as SubcategoryItem[] | undefined || []).map((sub) => (
                      <CarouselItem key={sub.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                        <Link href={`./categories/${cat.id}/sub/${sub.id}`} className="group block">
                          <div className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 ease-out group-hover:shadow-xl group-hover:-translate-y-1">
                            <div className="relative w-full h-56 md:h-64 transform-gpu will-change-transform">
                              {sub.imageUrl ? (
                                <Image
                                  src={sub.imageUrl}
                                  alt={sub.name}
                                  fill
                                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:skew-y-1"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
                            </div>
                            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-brand-gold/20 text-brand-gold dark:bg-amber-400/20 dark:text-amber-400">
                                  {tCat("subcategory")}
                                </span>
                              </div>
                              <div className="text-white text-lg font-extrabold leading-tight mb-1">
                                {sub.name}
                              </div>
                              <div className="text-xs text-white/80 flex items-center gap-1">
                                <span>{tCat("explore")}</span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800" />
                  <CarouselNext className="right-2 bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800" />
                </Carousel>
              </div>

              {/* Secondary promo after every 2 categories */}
              {((idx + 1) % 2 === 0) && (
                <div className="relative mt-12 mx-auto max-w-4xl">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 md:p-8 text-center shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-brand-navy dark:bg-amber-400 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 dark:bg-amber-400/10 border border-brand-gold/20 dark:border-amber-400/20 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold dark:bg-amber-400"></div>
                        <span className="text-xs font-medium text-brand-navy dark:!text-amber-400">
                          {tLinks("products")}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {tCat("promo2.title")}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                        {tCat("promo2.desc")}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Link href="/contact">
                          <button className="group relative px-6 py-3 bg-gradient-to-r from-brand-navy to-brand-navy-light hover:from-brand-navy-light hover:to-brand-navy text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 min-w-[160px]">
                            <span className="relative z-10">{tCat("promo2.ctaPrimary")}</span>
                          </button>
                      </Link>
                      <Link href="/portfolio">
                          <button className="group relative px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-brand-navy dark:!text-white font-semibold rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-gold dark:hover:border-amber-400 transform hover:-translate-y-0.5 transition-all duration-300 min-w-[160px]">
                            <span className="relative z-10">{tCat("promo2.ctaSecondary")}</span>
                          </button>
                      </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Main promo at the end */}
        <div className="relative mt-16 mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy/90 to-brand-gold/20 dark:from-gray-900 dark:via-gray-800 dark:to-amber-400/20 p-8 md:p-12 text-center shadow-2xl border border-gray-200/20 dark:border-gray-700/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold rounded-full blur-3xl transform -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-brand-gold rounded-full blur-3xl transform translate-x-20 translate-y-20"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 mb-6">
                <div className="w-2 h-2 rounded-full bg-brand-gold dark:bg-amber-400 animate-pulse"></div>
                <span className="text-sm font-medium text-white/90 dark:text-gray-300">
                  {tLinks("products")}
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white dark:text-amber-100 mb-4 leading-tight">
                {tCat("promo.title")}
              </h3>
              
              <p className="text-lg md:text-xl text-white/80 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {tCat("promo.desc")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-brand-gold to-yellow-400 hover:from-yellow-400 hover:to-brand-gold text-brand-navy font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]">
                    <span className="relative z-10">{tCat("promo.ctaPrimary")}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-brand-gold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
              </Link>
              <Link href="/services">
                  <button className="group relative px-8 py-4 bg-white/10 dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-700/40 text-white dark:text-gray-200 font-semibold rounded-xl border border-white/20 dark:border-gray-600/50 backdrop-blur-sm hover:border-white/30 dark:hover:border-gray-500/70 transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]">
                    <span className="relative z-10">{tCat("promo.ctaSecondary")}</span>
                  </button>
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}