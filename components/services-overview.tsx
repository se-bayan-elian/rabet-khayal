"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Sparkles
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useFeaturedServicesQuery, ServiceItem } from '@/services'

interface ServicesOverviewProps {
  title: string
  subtitle: string
}

export function ServicesOverview({ title, subtitle }: ServicesOverviewProps) {
  const t = useTranslations('services')
  const tGlobal = useTranslations()
  const { data: featuredServices, isLoading, error } = useFeaturedServicesQuery(4)

  // Default services as fallback
  const defaultServices = [
    {
      id: "default-1",
      icon: "/icons/code.svg",
      title: t('web.title', { default: 'Web Development' }),
      description: t('web.description', { default: 'Building modern and responsive websites' }),
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
      features: [t('features.onTimeDelivery', { default: 'On Time Delivery' }), t('features.competitivePricing', { default: 'Competitive Pricing' }), t('features.freeConsultation', { default: 'Free Consultation' })],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "default-2",
      icon: "/icons/palette.svg",
      title: t('design.title', { default: 'UI/UX Design' }),
      description: t('design.description', { default: 'Creating beautiful and intuitive designs' }),
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center",
      features: [t('features.onTimeDelivery', { default: 'On Time Delivery' }), t('features.competitivePricing', { default: 'Competitive Pricing' })],
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "default-3",
      icon: "/icons/bar-chart.svg",
      title: t('marketing.title', { default: 'Digital Marketing' }),
      description: t('marketing.description', { default: 'Grow your business with digital strategies' }),
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center",
      features: [t('features.onTimeDelivery', { default: 'On Time Delivery' }), t('features.competitivePricing', { default: 'Competitive Pricing' })],
      color: "from-green-500 to-green-600"
    },
    {
      id: "default-4",
      icon: "/icons/smartphone.svg",
      title: t('mobile.title', { default: 'Mobile Apps' }),
      description: t('mobile.description', { default: 'Cross-platform mobile applications' }),
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center",
      features: [t('features.onTimeDelivery', { default: 'On Time Delivery' }), t('features.competitivePricing', { default: 'Competitive Pricing' })],
      color: "from-orange-500 to-orange-600"
    }
  ]

  // Map fetched services to the expected format
  const services = featuredServices && featuredServices.length > 0
    ? featuredServices.slice(0, 4).map((service: ServiceItem, index) => {
      const serviceName = typeof service.name === 'string' ? service.name : service.name?.en || service.name?.ar || 'Service'
      const serviceDesc = service.description ?
        (typeof service.description === 'string' ? service.description : service.description?.en || service.description?.ar || 'Service description')
        : 'Service description'

      return {
        id: service.id,
        icon: service.icon || "/icons/default-service.svg",
        title: serviceName,
        description: serviceDesc,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center", // Default image since ServiceItem doesn't have image
        features: [
          t('features.onTimeDelivery', { default: 'On Time Delivery' }),
          t('features.competitivePricing', { default: 'Competitive Pricing' }),
          t('features.freeConsultation', { default: 'Free Consultation' })
        ],
        color: [
          "from-blue-500 to-blue-600",
          "from-purple-500 to-purple-600",
          "from-green-500 to-green-600",
          "from-orange-500 to-orange-600"
        ][index % 4]
      }
    })
    : defaultServices

  const features = [
    {
      icon: Shield,
      title: tGlobal('serviceHero.features.security.title', { default: 'High Security' }),
      description: tGlobal('serviceHero.features.security.desc', { default: 'Advanced data protection' })
    },
    {
      icon: Zap,
      title: tGlobal('serviceHero.features.performance.title', { default: 'Fast Performance' }),
      description: tGlobal('serviceHero.features.performance.desc', { default: 'Lightning-fast response time' })
    },
    {
      icon: Users,
      title: tGlobal('serviceHero.features.support.title', { default: 'Continuous Support' }),
      description: tGlobal('serviceHero.features.support.desc', { default: '24/7 customer service' })
    },
    {
      icon: Award,
      title: tGlobal('serviceHero.features.quality.title', { default: 'High Quality' }),
      description: tGlobal('serviceHero.features.quality.desc', { default: 'Advanced professional standards' })
    }
  ]

  return (
    <section className="section-padding bg-white dark:bg-gray-900">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-section-title brand-heading text-gray-900 dark:text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {title}
          </h2>
          <p className="text-xl max-w-3xl mx-auto mt-6 text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="service-card">
                <div className="flex items-start gap-6">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 mb-16">
            <p className="text-gray-600 mb-4">{t('error.message', { default: 'Failed to load featured services' })}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              {t('error.retry', { default: 'Try Again' })}
            </Button>
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => {
              // Service background images
              const serviceImages = [
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center"
              ]

              return (
                <Card
                  key={service.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 fade-in bg-white dark:bg-gray-800 dark:border-gray-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={service?.image ?? serviceImages[index % serviceImages.length]}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-500" />
                  </div>

                  {/* Content */}
                  <CardContent className="relative p-8 h-full flex flex-col justify-between min-h-[400px]">
                    {/* Top Section */}
                    <div className="space-y-4">
                      {/* Icon */}
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Image
                          width={32}
                          height={32}
                          src={service.icon || "/icons/default-service.svg"}
                          alt={service.title}
                          className="w-8 h-8 object-contain filter brightness-0 invert"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {service.title}
                      </h3>

                      {/* Description
                      <p className="text-lg text-gray-200 group-hover:text-white transition-colors duration-300" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {service.description}
                      </p> */}

                      {/* Features */}
                      <div className="grid grid-cols-1 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span className="text-sm text-gray-200 group-hover:text-white transition-colors duration-300" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Section - Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <Link href={`/services/${service.id}`} className="flex-1">
                        <Button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 group-hover:bg-white group-hover:text-gray-900" style={{ fontFamily: 'Tajwal, sans-serif' }}>
                          {t('viewDetails', { default: 'View Details' })}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href={`/services/${service.id}#portfolio`} className="flex-1">
                        <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 group-hover:bg-white group-hover:text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {t('detail.tabs.portfolio', { default: 'Portfolio' })}
                          <Award className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:scale-105 transition-all duration-300 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-amber-500 to-blue-600">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Enhanced Creative CTA Section */}
        <div className="text-center fade-in">
          <div className="cta-creative max-w-6xl mx-auto">
            {/* Decorative Elements */}
            <div className="cta-decorative-1"></div>
            <div className="cta-decorative-2"></div>
            <div className="cta-decorative-3"></div>
            
            <div className="cta-content">
              <div className="flex justify-center mb-8">
                <div className="cta-trust-icon">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="mb-6">
                {t('title', { default: 'Our Premium Services' })}
              </h3>

              <p className="mb-8 max-w-3xl mx-auto">
                {t('subtitle', { default: 'We offer comprehensive innovative tech solutions' })}
              </p>

              <div className="cta-buttons">
                <Button className="btn-cta-primary">
                  <Users className="w-5 h-5 mr-3" />
                  {t('features.freeConsultation', { default: 'Free Consultation' })}
                </Button>
                <Link href="/products">
                  <Button className="btn-cta-secondary">
                    {t('viewDetails', { default: 'View Details' })}
                    <ArrowRight className="w-5 h-5 mr-3" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex justify-center gap-6 text-sm opacity-90">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-4 h-4 text-yellow-300" />
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{t('features.freeConsultation', { default: 'Free Consultation' })}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-4 h-4 text-yellow-300" />
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{t('features.competitivePricing', { default: 'Competitive Pricing' })}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-4 h-4 text-yellow-300" />
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{t('features.onTimeDelivery', { default: 'On-time Delivery' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
