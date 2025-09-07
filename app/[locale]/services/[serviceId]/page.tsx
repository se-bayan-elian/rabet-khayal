"use client"

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowLeft, Star, Check, ExternalLink, Calendar, User, MessageSquare, Loader2, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { fetchServiceById, fetchServiceProjects, fetchServicePricingPlans } from '@/services/services'
import { Service, Project, PricingPlan } from '@/types/services'
import ServiceCardSkeleton from '@/components/services/ServiceCardSkeleton'

export default function ServicePage() {
  const t = useTranslations('services')
  const tDetail = useTranslations('services.detail')
  const router = useRouter()
  const params = useParams<any>()
  const searchParams = useSearchParams()

  // Fetch service details
  const {
    data: service,
    isLoading: serviceLoading,
    isError: serviceError
  } = useQuery<Service>({
    queryKey: ['service', params.serviceId],
    queryFn: () => fetchServiceById(params.serviceId),
    staleTime: 5000,
  })

  // Fetch service projects
  const {
    data: projects = [],
    isLoading: projectsLoading
  } = useQuery<Project[]>({
    queryKey: ['service-projects', params.serviceId],
    queryFn: () => fetchServiceProjects(params.serviceId),
    enabled: !!params.serviceId,
    staleTime: 5000,
  })

  // Fetch pricing plans
  const {
    data: pricingPlansData,
    isLoading: plansLoading
  } = useQuery({
    queryKey: ['service-pricing-plans', params.serviceId],
    queryFn: () => fetchServicePricingPlans(params.serviceId),
    enabled: !!params.serviceId,
    staleTime: 5000,
  })

  const pricingPlans = pricingPlansData || []

  // Handle contact navigation
  const handleRequestService = (planId?: string) => {
    const searchParams = new URLSearchParams()
    searchParams.set('serviceId', params.serviceId)
    if (planId) searchParams.set('pricingPlanId', planId)
    router.push(`/contact?${searchParams.toString()}`)
  }

  // Loading state
  if (serviceLoading) {
    return (
      <div className="pt-20">
        <div className="section-padding">
          <div className="section-container">
            <div className="space-y-8">
              <ServiceCardSkeleton />
              <ServiceCardSkeleton />
              <ServiceCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (serviceError || !service) {
    return (
      <div className="pt-20">
        <div className="section-padding">
          <div className="section-container">
            <Card className="p-8 text-center">
              <CardContent>
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-bold mb-2">{tDetail('notFound')}</h3>
                <p className="text-gray-600 mb-4">{tDetail('notFoundDescription')}</p>
                <Button onClick={() => router.push('/services')}>
                  {tDetail('backToServices')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src={service.image || '/placeholder-service.jpg'}
          alt={service.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="section-container text-white">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 brand-heading">{service.name}</h1>
              <p className="text-lg md:text-xl max-w-2xl mb-8">{service.description}</p>
              <Button
                onClick={() => handleRequestService()}
                className="btn-primary"
                size="lg"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                {tDetail('requestService')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding" style={{ background: 'var(--brand-bg)' }}>
        <div className="section-container">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="details" className="text-lg">{tDetail('tabs.details')}</TabsTrigger>
              <TabsTrigger value="projects" className="text-lg">{tDetail('tabs.projects')}</TabsTrigger>
            </TabsList>

            {/* Service Details & Pricing Plans */}
            <TabsContent value="details" className="space-y-12">
              {/* Service Info */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 brand-heading">{tDetail('serviceDetails')}</h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {tDetail('projectCount', { count: service.projectCount || projects.length })}
                      </div>
                    </div>
                  </div>
                  {service.image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Plans */}
              <div>
                <h2 className="text-2xl font-bold mb-8 brand-heading text-center">{tDetail('pricingPlans')}</h2>

                {plansLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <ServiceCardSkeleton key={index} />
                    ))}
                  </div>
                ) : pricingPlans.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CardContent>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Star className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{tDetail('noPricingPlans')}</h3>
                      <p className="text-gray-600 mb-4">{tDetail('noPricingPlansDescription')}</p>
                      <Button onClick={() => handleRequestService()}>
                        {tDetail('requestQuote')}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pricingPlans.map((plan) => (
                      <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${plan.isPopular ? 'border-2 shadow-xl scale-105' : 'hover:scale-105'}`} style={{
                        borderColor: plan.isPopular ? 'var(--brand-gold)' : undefined
                      }}>
                        {plan.isPopular && (
                          <div className="absolute top-0 right-6 transform -translate-y-1/2 px-4 py-1 rounded-full text-sm font-bold text-white" style={{ background: 'var(--brand-gold)' }}>
                            {tDetail('popular')}
                          </div>
                        )}
                        <CardContent className="p-6">
                          <h3 className="text-2xl font-bold mb-2 brand-heading">{plan.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

                          <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                              {plan.originalPrice !== plan.finalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                  ${plan.originalPrice}
                                </span>
                              )}
                              <span className="text-4xl font-bold" style={{ color: 'var(--brand-navy)' }}>
                                ${plan.finalPrice}
                              </span>
                            </div>
                            <span className="text-gray-600">/{plan.billingPeriod}</span>
                          </div>

                          <div className="space-y-3 mb-6">
                            {plan.deliveryDays && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-green-500" />
                                <span>{tDetail('deliveryTime', { days: plan.deliveryDays })}</span>
                              </div>
                            )}
                            {plan.revisions && (
                              <div className="flex items-center gap-2 text-sm">
                                <ArrowRight className="w-4 h-4 text-green-500" />
                                <span>{tDetail('revisions', { count: plan.revisions })}</span>
                              </div>
                            )}
                            {plan.features?.map((feature) => (
                              <div key={feature.id} className="flex items-start gap-2 text-sm">
                                <Check className={`w-4 h-4 shrink-0 mt-0.5 ${feature.isIncluded ? 'text-green-500' : 'text-red-500'}`} />
                                <span className={feature.isIncluded ? '' : 'line-through text-gray-400'}>
                                  {feature.name}
                                </span>
                              </div>
                            ))}
                          </div>

                          <Button
                            className="w-full btn-primary"
                            onClick={() => handleRequestService(plan.id)}
                          >
                            {tDetail('selectPlan')}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Projects Portfolio */}
            <TabsContent value="projects" className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 brand-heading">{tDetail('ourProjects')}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {tDetail('projectsDescription')}
                </p>
              </div>

              {projectsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ServiceCardSkeleton key={index} />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <Card className="p-8 text-center">
                  <CardContent>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{tDetail('noProjects')}</h3>
                    <p className="text-gray-600">{tDetail('noProjectsDescription')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <Card key={project.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={project.mainImageUrl || '/placeholder-project.jpg'}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2 brand-heading line-clamp-1">{project.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                        <div className="space-y-2 mb-4 text-sm text-gray-500">
                          {project.clientName && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{project.clientName}</span>
                            </div>
                          )}
                          {project.completionDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(project.completionDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          {project.projectUrl && (
                            <Link
                              href={project.projectUrl}
                              target="_blank"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {tDetail('viewLive')}
                            </Link>
                          )}
                          <Link href={`/services/projects/${project.id}`}>
                            <Button variant="ghost" size="sm" className="group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform">
                              {tDetail('viewProject')}
                              <ArrowRight className="w-4 h-4 ml-2 rtl:hidden" />
                              <ArrowLeft className="w-4 h-4 mr-2 ltr:hidden" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
