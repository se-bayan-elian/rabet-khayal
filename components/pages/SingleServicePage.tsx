"use client"

import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowLeft, Star, Check, ExternalLink, Calendar, User, MessageSquare, Loader2, AlertTriangle, Target, Award, Clock, Users, Zap, Shield } from "lucide-react"
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
  const searchParams = useSearchParams();
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

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

  const pricingPlans = Array.isArray(pricingPlansData) ? pricingPlansData : (pricingPlansData?.data || [])

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
            <Card className="p-8 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent>
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500 dark:text-yellow-400" />
                <h3 className="text-xl font-bold mb-2 dark:text-white">{tDetail('notFound')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tDetail('notFoundDescription')}</p>
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
              <h1 className="text-3xl text-center md:text-5xl font-bold mb-6  !text-white">{service.name}</h1>
              <Button
                onClick={() => handleRequestService()}
                className="btn-primary flex mx-auto"
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
      <section className="section-padding bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800" style={{ background: 'var(--brand-bg)' }}>
        <div className="section-container">
          <Tabs defaultValue="details" className="w-full h-full" dir={dir}>
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-fit">
              <TabsTrigger 
                value="details" 
                className="text-lg font-semibold rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                {tDetail('tabs.details')}
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="text-lg font-semibold rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                {tDetail('tabs.projects')}
              </TabsTrigger>
            </TabsList>

            {/* Service Details & Pricing Plans */}
            <TabsContent value="details" className="space-y-12">
              {/* Service Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 brand-heading dark:text-white">{tDetail('serviceDetails')}</h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 html-content"
                         dangerouslySetInnerHTML={{ __html: service.description || "" }}
                    >
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 dark:text-gray-500" />
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
                <h2 className="text-2xl font-bold mb-8 brand-heading text-center dark:text-white">{tDetail('pricingPlans')}</h2>

                {plansLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <ServiceCardSkeleton key={index} />
                    ))}
                  </div>
                ) : pricingPlans?.length === 0 ? (
                  <Card className="p-8  text-center overflow-x-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Star className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">{tDetail('noPricingPlans')}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{tDetail('noPricingPlansDescription')}</p>
                      <Button onClick={() => handleRequestService()}>
                        {tDetail('requestQuote')}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pricingPlans?.map((plan: any) => (
                      <Card key={plan.id} className={`relative overflow-visible transition-all duration-300 hover:shadow-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${plan.isPopular ? 'border-2 shadow-xl scale-105' : 'hover:scale-105'}`} style={{
                        borderColor: plan.isPopular ? 'var(--brand-gold)' : undefined
                      }}>
                        {plan.isPopular && (
                          <div className="absolute top-0 right-6 transform -translate-y-1/2 px-4 py-1 rounded-full text-sm font-bold text-white" style={{ background: 'var(--brand-gold)' }}>
                            {tDetail('popular')}
                          </div>
                        )}
                        <CardContent className="p-6 h-full items-between">
                          <h3 className="text-2xl font-bold mb-2 brand-heading dark:text-white">{plan.name}</h3>
                          <div className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 html-content"
                               dangerouslySetInnerHTML={{ __html: plan.description || "" }}
                          >
                          </div>

                          <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                              {plan.originalPrice !== plan.finalPrice && (
                                <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                                  {plan.originalPrice} ﷼
                                </span>
                              )}
                              <span className="text-4xl font-bold dark:!text-white" style={{ color: 'var(--brand-navy)' }}>
                                {plan.finalPrice} ﷼
                              </span>
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">/{tDetail(`billingPeriod.${plan.billingPeriod}`)}</span>
                          </div>

                          <div className="space-y-3 mb-6">
                            {plan.deliveryDays && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-green-500 dark:text-green-400" />
                                <span className="dark:text-gray-300">{tDetail('deliveryTime', { days: plan.deliveryDays })}</span>
                              </div>
                            )}
                            {plan.revisions && (
                              <div className="flex items-center gap-2 text-sm">
                                <ArrowRight className="w-4 h-4 text-green-500 dark:text-green-400" />
                                <span className="dark:text-gray-300">{tDetail('revisions', { count: plan.revisions })}</span>
                              </div>
                            )}
                            {plan.features?.map((feature: any) => (
                              <div key={feature.id} className="flex items-start gap-2 text-sm">
                                <Check className={`w-4 h-4 shrink-0 mt-0.5 ${feature.isIncluded ? 'text-green-500' : 'text-red-500'}`} />
                                <span className={feature.isIncluded ? 'dark:text-gray-300' : 'line-through text-gray-400 dark:text-gray-500'}>
                                  {feature.name}
                                </span>
                              </div>
                            ))}
                          </div>
                            <div className="flex items-end flex-1 justify-between">

                          <Button
                            className="w-full btn-primary mt-auto flex"
                            onClick={() => handleRequestService(plan.id)}
                            >
                            {tDetail('selectPlan')}
                          </Button>
                            </div>
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
                <h2 className="text-2xl font-bold mb-4 brand-heading dark:text-white">{tDetail('ourProjects')}</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                <Card className="p-8 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Star className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">{tDetail('noProjects')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{tDetail('noProjectsDescription')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <Card key={project.id} className="group overflow-hidden hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
                        <h3 className="text-xl font-bold mb-2 brand-heading line-clamp-1 dark:text-white">{project.title}</h3>
                        <div className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 html-content"
                             dangerouslySetInnerHTML={{ __html: project.description || "" }}
                        >
                        </div>

                        <div className="space-y-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                          {project.clientName && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 dark:text-gray-500" />
                              <span>{project.clientName}</span>
                            </div>
                          )}
                          {project.completionDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 dark:text-gray-500" />
                              <span>{new Date(project.completionDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          {project.projectUrl && (
                            <a
                              href={project.projectUrl}
                              target="_blank"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {tDetail('viewLive')}
                            </a>
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

      {/* Enhanced Sections After Tabs */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="section-container">
          <div className="max-w-6xl mx-auto">
            {/* Key Features Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 brand-heading dark:text-white">
                  {tDetail('keyFeatures')}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Target, text: tDetail('features.customizedSolutions'), color: "text-blue-500" },
                  { icon: Award, text: tDetail('features.professionalQuality'), color: "text-amber-500" },
                  { icon: Clock, text: tDetail('features.fastDelivery'), color: "text-green-500" },
                  { icon: Users, text: tDetail('features.expertTeam'), color: "text-purple-500" },
                  { icon: Zap, text: tDetail('features.modernTechnology'), color: "text-orange-500" },
                  { icon: Shield, text: tDetail('features.qualityGuarantee'), color: "text-red-500" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700  hover:shadow-xl transition-all duration-300">
                    <div className={`p-3 rounded-full bg-gray-50 dark:bg-gray-700 ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200 rtl:text-right">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 brand-heading dark:text-white">
                  {tDetail('whyChooseUs')}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className=" space-y-4" >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center ">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {tDetail('benefits.professionalExcellence')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 rtl:text-right">
                      {tDetail('benefits.professionalExcellenceDesc')}
                    </p>
                  </div>
                  <div className="text-center space-y-4 rtl:text-right">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center ">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {tDetail('benefits.timelyDelivery')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 rtl:text-right">
                      {tDetail('benefits.timelyDeliveryDesc')}
                    </p>
                  </div>
                  <div className="text-center space-y-4 rtl:text-right">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center ">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {tDetail('benefits.expertSupport')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 rtl:text-right">
                      {tDetail('benefits.expertSupportDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 brand-heading dark:text-white">
                  {tDetail('process')}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full"></div>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { number: 1, title: tDetail('steps.consultation'), description: tDetail('steps.consultationDesc') },
                  { number: 2, title: tDetail('steps.planning'), description: tDetail('steps.planningDesc') },
                  { number: 3, title: tDetail('steps.development'), description: tDetail('steps.developmentDesc') },
                  { number: 4, title: tDetail('steps.delivery'), description: tDetail('steps.deliveryDesc') }
                ].map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center rtl:text-right hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 rtl:mx-auto">
                        <span className="text-white font-bold text-lg">{step.number}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm rtl:text-right">
                        {step.description}
                      </p>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 rtl:right-auto rtl:-left-3">
                        <ArrowRight className="w-6 h-6 text-gray-400 rtl:hidden" />
                        <ArrowLeft className="w-6 h-6 text-gray-400 ltr:hidden" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Call to Action */}
            <div className="relative overflow-hidden">
              <div className="cta-creative">
                {/* Decorative Elements */}
                <div className="cta-decorative-1"></div>
                <div className="cta-decorative-2"></div>
                <div className="cta-decorative-3"></div>
                
                {/* Content */}
                <div className="cta-content">
                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                    <div className="cta-trust-icon">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="mb-6">
                    {tDetail('cta.readyToStart')}
                  </h3>
                  
                  {/* Description */}
                  <p className="mb-8 max-w-3xl mx-auto">
                    {tDetail('cta.description')}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="cta-buttons">
                    <Button
                      onClick={() => handleRequestService()}
                      className="btn-cta-primary"
                      size="lg"
                    >
                      <MessageSquare className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                      {tDetail('getStarted')}
                    </Button>
                    <Button
                      variant="outline"
                      className="btn-cta-secondary"
                      size="lg"
                    >
                      <ArrowRight className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 rtl:hidden" />
                      <ArrowLeft className="w-5 h-5 ml-3 rtl:ml-0 rtl:mr-3 ltr:hidden" />
                      {tDetail('learnMore')}
                    </Button>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="cta-trust-indicators">
                    <div className="cta-trust-item">
                      <div className="cta-trust-icon">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <span className="cta-trust-text">{tDetail('cta.trustIndicators.expertTeam')}</span>
                    </div>
                    <div className="cta-trust-item">
                      <div className="cta-trust-icon">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <span className="cta-trust-text">{tDetail('cta.trustIndicators.fastDelivery')}</span>
                    </div>
                    <div className="cta-trust-item">
                      <div className="cta-trust-icon">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <span className="cta-trust-text">{tDetail('cta.trustIndicators.qualityGuarantee')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
