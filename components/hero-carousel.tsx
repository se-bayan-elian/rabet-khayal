"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowRight,
  Users,
  Sparkles,
  Rocket,
  TrendingUp,
  Palette,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useBannersQuery } from '@/services'
import CarouselSkeleton from "./hero-carousel-skeleton"

// Banner types
enum IntegrationType {
  PRODUCT = "product",
  CATEGORY = "category",
  SUBCATEGORY = "subcategory",
  SERVICE = "service",
  EXTERNAL_URL = "external_url",
}

interface HeroCarouselProps {
  title: string
  subtitle: string
  cta: string
}

export function HeroCarousel({ title, subtitle, cta }: HeroCarouselProps) {
  const t = useTranslations('hero')
  const tBanner = useTranslations('banner')
  const { data: banners, isLoading, error } = useBannersQuery(5)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Helper function to generate link based on integration type
  const generateBannerLink = (banner: any) => {
    switch (banner.integrationType) {
      case IntegrationType.PRODUCT:
        return `/products/${banner.productId}`
      case IntegrationType.CATEGORY:
        return `/categories/${banner.categoryId}`
      case IntegrationType.SUBCATEGORY:
        return `/categories/${banner.categoryId}/subcategories/${banner.subcategoryId}`
      case IntegrationType.SERVICE:
        return `/services/${banner.serviceId}`
      case IntegrationType.EXTERNAL_URL:
        return banner.externalUrl || '/'
      default:
        return '/'
    }
  }

  // Helper function to get promotional badge text based on integration type
  const getPromotionalBadge = (banner: any) => {
    switch (banner.integrationType) {
      case IntegrationType.PRODUCT:
        return tBanner('badges.featuredProduct', { default: 'Featured Product' })
      case IntegrationType.CATEGORY:
        return tBanner('badges.amazingCategory', { default: 'Amazing Category' })
      case IntegrationType.SUBCATEGORY:
        return tBanner('badges.featuredSubcategory', { default: 'Featured Subcategory' })
      case IntegrationType.SERVICE:
        return tBanner('badges.professionalService', { default: 'Professional Service' })
      case IntegrationType.EXTERNAL_URL:
        return tBanner('badges.specialOffer', { default: 'Special Offer' })
      default:
        return tBanner('badges.featured', { default: 'Featured' })
    }
  }

  // Helper function to get promotional stats based on integration type
  const getPromotionalStats = (banner: any) => {
    switch (banner.integrationType) {
      case IntegrationType.PRODUCT:
        return [
          { label: tBanner('stats.productViews', { default: 'Product Views' }), value: "2.5K+" },
          { label: tBanner('stats.productClicks', { default: 'Product Clicks' }), value: "850+" },
          { label: tBanner('stats.customerRating', { default: 'Customer Rating' }), value: "4.9⭐" }
        ]
      case IntegrationType.CATEGORY:
        return [
          { label: tBanner('stats.categoryProducts', { default: 'Category Products' }), value: "150+" },
          { label: tBanner('stats.categoryViews', { default: 'Category Views' }), value: "5.2K+" },
          { label: tBanner('stats.customerRating', { default: 'Customer Rating' }), value: "4.8⭐" }
        ]
      case IntegrationType.SERVICE:
        return [
          { label: tBanner('stats.completedProjects', { default: 'Completed Projects' }), value: "500+" },
          { label: tBanner('stats.satisfiedClients', { default: 'Satisfied Clients' }), value: "98%" },
          { label: tBanner('stats.serviceRating', { default: 'Service Rating' }), value: "5.0⭐" }
        ]
      default:
        return [
          { label: tBanner('stats.bannerViews', { default: 'Banner Views' }), value: "10K+" },
          { label: tBanner('stats.bannerClicks', { default: 'Banner Clicks' }), value: "1.2K+" },
          { label: tBanner('stats.clickRate', { default: 'Click Rate' }), value: "18%" }
        ]
    }
  }

  // Helper function to highlight last 2 words of title
  const highlightTitleWords = (title: string) => {
    const words = title.split(' ')
    if (words.length <= 2) {
      return (
        <span className="relative inline-block font-black" style={{ color: 'var(--brand-gold)' }}>
          {title}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
        </span>
      )
    }

    const regularWords = words.slice(0, -2).join(' ')
    const highlightWords = words.slice(-2).join(' ')

    return (
      <>
        {regularWords}{" "}
        <span className="relative inline-block font-black" style={{ color: 'var(--brand-gold)' }}>
          {highlightWords}
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
        </span>
      </>
    )
  }

  // Default slides as fallback
  const defaultSlides = [
    {
      id: "default-1",
      title: title || "Transform Your Digital Vision",
      description: subtitle || "We provide comprehensive and innovative technical solutions",
      imageUrl: "/placeholder.jpg",
      linkUrl: "/services",
      linkText: cta || "Get Started",
      badge: "Advanced Technical Solutions",
      highlight: "Into Inspiring Reality",
      icon: Rocket,
      gradient: "from-blue-600 via-purple-600 to-blue-800",
      stats: [
        { label: "Completed Projects", value: "500+" },
        { label: "Satisfied Clients", value: "300+" },
        { label: "Years Experience", value: "8+" }
      ]
    },
    {
      id: "default-2",
      title: "Unique Creative Design",
      description: "Professional designers create distinctive creative imprints on every project",
      imageUrl: "/placeholder.jpg",
      linkUrl: "/services",
      linkText: cta || "Get Started",
      badge: "Creative Excellence",
      highlight: "And Achieve Results",
      icon: Palette,
      gradient: "from-purple-600 via-pink-600 to-purple-800",
      stats: [
        { label: "Designs Completed", value: "1000+" },
        { label: "Design Awards", value: "25+" },
        { label: "Satisfaction Rate", value: "99%" }
      ]
    }
  ]
  // Use banners if available, otherwise use default slides
  const slides = banners && banners.length > 0
    ? banners.map((banner: any, index: number) => ({
      id: banner.id,
      title: banner.title,
      description: banner.description || subtitle || "",
      imageUrl: banner.imageUrl,
      linkUrl: generateBannerLink(banner),
      linkText: cta || tBanner('discoverMore', { default: 'Discover More' }),
      badge: getPromotionalBadge(banner),
      highlight: "",
      icon: [Rocket, Palette, TrendingUp][index % 3],
      gradient: [
        "from-blue-600 via-purple-600 to-blue-800",
        "from-purple-600 via-pink-600 to-purple-800",
        "from-green-600 via-teal-600 to-green-800"
      ][index % 3],
      stats: getPromotionalStats(banner),
      integrationType: banner.integrationType
    }))
    : defaultSlides

  // Enhanced auto-play with pause on hover
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [currentSlide, isAutoPlaying, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Ensure currentSlide is within bounds
  const safeCurrentSlide = slides.length > 0 ? Math.min(currentSlide, slides.length - 1) : 0
  const currentSlideData = slides[safeCurrentSlide] || slides[0] || defaultSlides[0]
  const Icon = currentSlideData?.icon || Rocket

  if (isLoading) {
    return (
      <CarouselSkeleton />
    )
  }

  // If no slides available, show error state
  if (!slides || slides.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">No banners available</h2>
          <p className="text-gray-600 dark:text-gray-400">Please check back later.</p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative min-h-[calc(100vh - 80px)] flex items-start justify-center overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background with Enhanced Gradient */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} opacity-90`} />
        <div className="absolute inset-0 bg-black/20" />

        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/5 animate-pulse" />
        <div className="absolute bottom-32 left-16 w-96 h-96 rounded-full bg-yellow-400/10" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
      </div>

      {/* Main Content */}
      <div className="lg:section-container px-4 relative z-10 !py-12 lg:py-16">
        <div className="grid  lg:grid-cols-2 gap-12 items-center  lg:px-6">

          {/* Content Side */}
          <div className="order-2 lg:order-1 text-white space-y-6 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <Icon className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>{currentSlideData.badge}</span>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {highlightTitleWords(currentSlideData.title)}
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {currentSlideData.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={currentSlideData.linkUrl}>
                <Button className="btn-cta-primary text-lg px-6 py-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Users className="w-5 h-5 mr-3" />
                  {currentSlideData.linkText}
                </Button>
              </Link>
              <Link href="/about">
                <Button className="btn-cta-secondary text-lg px-6 py-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <ArrowRight className="w-5 h-5 mr-3" />
                  {t('learnMore', { default: 'Learn More' })}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {currentSlideData.stats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-300 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="order-1 lg:order-2 relative  lg:px-0">
            <Link href={currentSlideData.linkUrl} className="block group">
              <div className="relative w-full h-80 lg:h-[450px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                <Image
                  src={currentSlideData.imageUrl}
                  alt={currentSlideData.title}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Floating Icon */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30">
                  <Icon className="w-6 h-6 text-yellow-300" />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Click Indicator */}
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {tBanner('clickToNavigate', { default: 'Click to Navigate' })}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4">
          {/* Indicators
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div> */}

          {/* Auto-play Toggle */}
          <button
            onClick={toggleAutoPlay}
            className="carousel-control relative"
            title={isAutoPlaying ? tBanner('pauseAutoplay', { default: 'Pause Autoplay' }) : tBanner('startAutoplay', { default: 'Start Autoplay' })}
          >
            {isAutoPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {/* <button
        onClick={prevSlide}
        className="carousel-control prev"
        title="الشريحة السابقة"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="carousel-control next"
        title="الشريحة التالية"
      >
        <ChevronLeft className="w-6 h-6" />
      </button> */}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300"
          style={{
            width: `${((safeCurrentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </section>
  )
}
