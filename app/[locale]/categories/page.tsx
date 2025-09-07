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
      <div className="min-h-screen bg-gray-50">
        <div className="section-container section-padding">
          <div className="mb-14 text-center">
            <Skeleton className="h-6 w-24 mx-auto mb-3" />
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <div className="space-y-16">
            {[1, 2, 3].map((idx) => (
              <section key={idx} className="space-y-8">
                <Skeleton className="w-full h-44 sm:h-56 md:h-64 rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-full h-56 md:h-64 rounded-2xl" />
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="section-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: 'var(--brand-accent)' }}>
              <AlertCircle className="w-8 h-8" style={{ color: 'var(--brand-navy)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-4 brand-heading">{tCat("error.title")}</h2>
            <p className="text-gray-600 mb-6">{tCat("error.message")}</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="section-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: 'var(--brand-accent)' }}>
              <Home className="w-8 h-8" style={{ color: 'var(--brand-navy)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-4 brand-heading">{tCat("empty.title")}</h2>
            <p className="text-gray-600 mb-6">{tCat("empty.message")}</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="section-container section-padding px-4 md:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wide"
            style={{ background: 'var(--brand-accent)', color: 'var(--brand-navy)' }}>
            {tLinks("products")}
          </span>
          <h1 className="text-section-title brand-heading mt-3">{tCat("heading")}</h1>
          <p className="mt-2 text-sm md:text-base max-w-2xl mx-auto" style={{ color: 'var(--brand-text-secondary)' }}>
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
                  <div className="w-full h-full bg-gradient-to-r from-brand-navy to-brand-navy/80" />
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
                      <div className="w-12 h-12 rounded-lg bg-white/90 p-2 shadow-md">
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
                                <div className="w-full h-full gradient-subtle" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
                            </div>
                            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold"
                                  style={{ background: 'rgba(255, 204, 0, 0.2)', color: 'var(--brand-gold)' }}>
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
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>

              {/* Secondary promo after every 2 categories */}
              {((idx + 1) % 2 === 0) && (
                <div className="cta-creative mt-12 mx-auto max-w-5xl text-center">
                  <div className="cta-content">
                    <h3>{tCat("promo2.title")}</h3>
                    <p>{tCat("promo2.desc")}</p>
                    <div className="cta-buttons">
                      <Link href="/contact">
                        <button className="btn-cta-primary">{tCat("promo2.ctaPrimary")}</button>
                      </Link>
                      <Link href="/portfolio">
                        <button className="btn-cta-secondary">{tCat("promo2.ctaSecondary")}</button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Main promo at the end */}
        <div className="cta-creative mt-16 mx-auto max-w-5xl text-center">
          <div className="cta-content">
            <h3>{tCat("promo.title")}</h3>
            <p>{tCat("promo.desc")}</p>
            <div className="cta-buttons">
              <Link href="/contact">
                <button className="btn-cta-primary">{tCat("promo.ctaPrimary")}</button>
              </Link>
              <Link href="/services">
                <button className="btn-cta-secondary">{tCat("promo.ctaSecondary")}</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}