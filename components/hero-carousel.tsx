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

interface HeroCarouselProps {
  title: string
  subtitle: string
  cta: string
}

export function HeroCarousel({ title, subtitle, cta }: HeroCarouselProps) {
  const t = useTranslations('hero')
  const { data: banners, isLoading, error } = useBannersQuery(5)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

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
    ? banners.map((banner, index) => ({
      id: banner.id,
      title: banner.title,
      description: banner.description || subtitle || "",
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "/services",
      linkText: banner.linkText || cta || "Learn More",
      badge: `Featured Banner ${index + 1}`,
      highlight: "",
      icon: [Rocket, Palette, TrendingUp][index % 3],
      gradient: [
        "from-blue-600 via-purple-600 to-blue-800",
        "from-purple-600 via-pink-600 to-purple-800",
        "from-green-600 via-teal-600 to-green-800"
      ][index % 3],
      stats: [
        { label: "Projects", value: "500+" },
        { label: "Clients", value: "300+" },
        { label: "Years", value: "8+" }
      ]
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

  const currentSlideData = slides[currentSlide]
  const Icon = currentSlideData?.icon || Rocket

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/5 animate-pulse" />
        <div className="absolute bottom-32 left-16 w-96 h-96 rounded-full bg-yellow-400/10" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5" style={{ animation: 'pulse 4s ease-in-out infinite' }} />

        <div className="section-container px-6 relative z-10 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center px-4 lg:px-6">
            {/* Content Side Skeleton */}
            <div className="text-white space-y-6">
              {/* Badge Skeleton */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                <Skeleton className="w-4 h-4 bg-white/30 rounded" />
                <Skeleton className="h-4 w-32 bg-white/30" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-white/20" />
                <Skeleton className="h-12 w-4/5 bg-white/20" />
                <Skeleton className="h-8 w-3/5 bg-white/20" />
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full bg-white/20" />
                <Skeleton className="h-5 w-4/5 bg-white/20" />
                <Skeleton className="h-5 w-3/5 bg-white/20" />
              </div>

              {/* Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 w-40 bg-white/20 rounded-lg" />
                <Skeleton className="h-12 w-36 bg-white/20 rounded-lg" />
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="text-center space-y-2">
                    <Skeleton className="h-8 w-16 bg-white/20 mx-auto" />
                    <Skeleton className="h-4 w-20 bg-white/20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Side Skeleton */}
            <div className="relative px-2 lg:px-0">
              <div className="relative w-full h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                <Skeleton className="w-full h-full bg-white/20" />
                {/* Floating Icon Skeleton */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Skeleton className="w-6 h-6 bg-white/30 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 w-1/3 animate-pulse" />
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background with Enhanced Gradient */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} opacity-90`} />
        <div className="absolute inset-0 bg-black/20" />

        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/5 animate-pulse" />
        <div className="absolute bottom-32 left-16 w-96 h-96 rounded-full bg-yellow-400/10" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
      </div>

      {/* Main Content */}
      <div className="section-container px-6 relative z-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center px-4 lg:px-6">

          {/* Content Side */}
          <div className="text-white space-y-6 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <Icon className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium" style={{ fontFamily: 'Tajwal, sans-serif' }}>{currentSlideData.badge}</span>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {currentSlideData.title}{" "}
                {currentSlideData.highlight && (
                  <span
                    className="relative inline-block font-black"
                    style={{ color: 'var(--brand-gold)' }}
                  >
                    {currentSlideData.highlight}
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
                  </span>
                )}
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                {currentSlideData.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={currentSlideData.linkUrl}>
                <Button className="btn-cta-primary text-lg px-6 py-3" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                  <Users className="w-5 h-5 mr-3" />
                  {currentSlideData.linkText}
                </Button>
              </Link>
              <Link href="/about">
                <Button className="btn-cta-secondary text-lg px-6 py-3" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                  <ArrowRight className="w-5 h-5 mr-3" />
                  {t('learnMore', { default: 'Learn More' })}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {currentSlideData.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-300 mb-1" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative px-2 lg:px-0">
            <div className="relative w-full h-80 lg:h-[450px] rounded-2xl overflow-hidden">
              <Image
                src={currentSlideData.imageUrl}
                alt={currentSlideData.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Floating Icon */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
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
            title={isAutoPlaying ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي"}
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
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </section>
  )
}
