"use client"

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, Phone, MapPin, Send, Check, AlertTriangle, Loader2 } from "lucide-react"
import { fetchServices, fetchServiceById, fetchServicePricingPlans, submitContactForm } from '@/services/services'
import { ContactFormRequest } from '@/types/services'

export default function ContactPage() {
  const t = useTranslations('contact')
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const pricingPlanId = searchParams.get('pricingPlanId')
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formData, setFormData] = useState<ContactFormRequest>({
    name: '',
    email: '',
    serviceId: serviceId || '',
    pricingPlanId: pricingPlanId || '',
    message: '',
    phone: '',
    company: '',
  })

  // Fetch services for dropdown
  const { data: servicesData } = useQuery({
    queryKey: ['services-contact'],
    queryFn: () => fetchServices({ page: 1, limit: 50 }),
    staleTime: 300000, // 5 minutes
  })

  // Fetch selected service details
  const { data: selectedService } = useQuery({
    queryKey: ['service-contact', serviceId],
    queryFn: () => fetchServiceById(serviceId!),
    enabled: !!serviceId,
    staleTime: 300000,
  })

  // Fetch pricing plans for selected service
  const { data: pricingPlansData } = useQuery({
    queryKey: ['pricing-plans-contact', serviceId],
    queryFn: () => fetchServicePricingPlans(serviceId!),
    enabled: !!serviceId,
    staleTime: 300000,
  })

  // Submit form mutation
  const submitMutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      setShowSuccessModal(true)
      // Reset form
      setFormData({
        name: '',
        email: '',
        serviceId: serviceId || '',
        pricingPlanId: '',
        message: '',
        phone: '',
        company: '',
      })
    },
  })

  // Update form when URL params change
  useEffect(() => {
    if (serviceId && serviceId !== formData.serviceId) {
      setFormData(prev => ({ ...prev, serviceId }))
    }
    if (pricingPlanId && pricingPlanId !== formData.pricingPlanId) {
      setFormData(prev => ({ ...prev, pricingPlanId }))
    }
  }, [serviceId, pricingPlanId, formData.serviceId, formData.pricingPlanId])

  const handleInputChange = (field: keyof ContactFormRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear pricing plan when service changes
    if (field === 'serviceId' && value !== formData.serviceId) {
      setFormData(prev => ({ ...prev, pricingPlanId: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.serviceId || !formData.message) {
      return
    }

    submitMutation.mutate(formData)
  }

  const services = servicesData?.data || []
  const pricingPlans = Array.isArray(pricingPlansData) ? pricingPlansData : (pricingPlansData?.data || [])
  const selectedPlan = Array.isArray(pricingPlans) ? pricingPlans.find((plan: any) => plan.id === formData.pricingPlanId) : null

  return (
    <div className="min-h-screen pt-20 overflow-x-hidden max-w-[100vw] bg-white dark:bg-gray-900">
      {/* Enhanced Hero Section */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" style={{ 
        // background: 'linear-gradient(135deg, rgba(255,204,0,0.1) 0%, rgba(255,255,255,0.95) 50%, rgba(28,28,60,0.05) 100%)' 
      }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-gray-600/5 dark:to-gray-500/5 animate-float"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 dark:from-gray-600/5 dark:to-gray-500/5 animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-green-400/15 to-emerald-500/15 dark:from-gray-600/3 dark:to-gray-500/3 animate-pulse"></div>
        </div>
        <div className="section-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-creative dark:text-white dark:bg-gradient-to-r dark:from-white dark:via-amber-100 dark:to-amber-200 dark:bg-clip-text dark:text-transparent leading-tight animate-pulse-slow">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 dark:text-amber-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              {t('description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-amber-100">{t('status.available')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg dark:shadow-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-amber-100">{t('status.quickResponse')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Enhanced Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0 card-creative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="relative">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-bounce opacity-70"></div>
                  <CardTitle className="text-3xl brand-heading dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">📝</span>
                    </div>
                    {serviceId ? t('serviceRequest') : t('getInTouch')}
                  </CardTitle>
                  {selectedService && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                      <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="text-amber-600 dark:text-amber-400">🎯</span>
                        {t('serviceSelected')}: <span className="font-bold text-amber-700 dark:text-amber-300">{selectedService.name}</span>
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Enhanced Personal Information */}
                    <div className="space-y-6">
                      <div className="border-l-4 border-amber-400 pl-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                          <span className="text-amber-600">👤</span>
                          {t('form.personalInfo')}
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                            <span className="text-amber-600">🏷️</span>
                            {t('form.name')} *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder={t('form.namePlaceholder')}
                            required
                            className="input-enhanced focus-creative"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                            <span className="text-amber-600">📧</span>
                            {t('form.email')} *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder={"example@example.com"}
                            required
                            dir="ltr"
                            className="input-enhanced focus-creative"
                          />
                      </div>
                    </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                          <span className="text-amber-600">📱</span>
                          {t('form.phone')}
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder={"+966 123 456 789"}
                          dir="ltr"
                          className="input-enhanced focus-creative"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                          <span className="text-amber-600">🏢</span>
                          {t('form.company')}
                        </Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder={t('form.companyPlaceholder')}
                          className="input-enhanced focus-creative"
                        />
                      </div>
                    </div>

                    {/* Enhanced Service Selection */}
                    <div className="space-y-6">
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                          <span className="text-blue-600">🛠️</span>
                          {t('form.serviceDetails')}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                          <span className="text-blue-600">⚙️</span>
                          {t('form.service')} *
                        </Label>
                        <Select
                          value={formData.serviceId}
                          onValueChange={(value) => handleInputChange('serviceId', value)}
                          required
                          dir={dir}
                        >
                          <SelectTrigger className="h-14 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder={t('form.selectService')} />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🔧</span>
                                  <span className="font-medium">{service.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Enhanced Pricing Plan Selection */}
                      {formData.serviceId && Array.isArray(pricingPlans) && pricingPlans.length > 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="pricingPlan" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                            <span className="text-blue-600">💰</span>
                            {t('form.pricingPlan')}
                          </Label>
                          <Select
                            value={formData.pricingPlanId}
                            onValueChange={(value) => handleInputChange('pricingPlanId', value)}
                            dir={dir}
                         >
                            <SelectTrigger className="h-14 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 gap-2">
                              <SelectValue className='gap-4' placeholder={t('form.selectPlan')} />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-full">
                              {Array.isArray(pricingPlans) && pricingPlans.map((plan: any) => (
                                <SelectItem key={plan.id} value={plan.id} className='w-full'>
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">💵</span>
                                      <span className="font-medium">{plan.name}</span>
                                    </div>
                                    <span className="text-amber-600 dark:text-amber-400 font-bold">{plan.finalPrice} ﷼</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedPlan && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm">✓</span>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
                                    {selectedPlan.name} - <span className="text-amber-600 dark:text-amber-400">{selectedPlan.finalPrice} ﷼</span>
                                  </p>
                                  {selectedPlan.description && (
                                    <div className="text-sm text-blue-600 dark:text-blue-400 mt-1 html-content" dangerouslySetInnerHTML={{ __html: selectedPlan.description }}></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Enhanced Message */}
                    <div className="space-y-6">
                      <div className="border-l-4 border-green-400 pl-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                          <span className="text-green-600">💬</span>
                          {t('form.messageSection')}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                          <span className="text-green-600">📝</span>
                          {t('form.message')} *
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder={t('form.messagePlaceholder')}
                          rows={6}
                          required
                          className="min-h-[150px] resize-y bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span>💡</span>
                          كلما كانت رسالتك أكثر تفصيلاً، كلما تمكنا من خدمتك بشكل أفضل
                        </p>
                      </div>
                    </div>

                    {/* Error Display */}
                    {submitMutation.isError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {t('form.error')}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Enhanced Submit Button */}
                    <div className="pt-6 border-t border-amber-100 dark:border-amber-900/20">
                      <Button
                        type="submit"
                        variant="creative"
                        className="w-full items-center flex-row"
                        disabled={submitMutation.isPending}
                        size="xl"
                      >
                        {submitMutation.isPending ? (
                          <div className='flex items-center gap-2'>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            <span className="text-lg font-bold">{t('form.sending')}</span>
                          </div>
                        ) : (
                          <div className='flex items-center gap-2'>
                            <Send className="w-5 h-5 mr-3" />
                            <span className="text-lg font-bold">{t('form.submit')}</span>
                            <div className="ml-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                              <span className="text-xs">🚀</span>
                            </div>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="shadow-2xl border-0 card-creative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className='xl:px-4 px-0'>
                  <CardTitle className="brand-heading dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">📞</span>
                    </div>
                    {t('contactInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 px-0 xl:px-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-gold)' }}>
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 dark:text-gray-200">{t('email')}</h4>
                      <p className="text-gray-600 dark:text-gray-400">info@rabetalkhayal.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-gold)' }}>
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 dark:text-gray-200">{t('phone')}</h4>
                      <p dir="ltr" className="text-gray-600 dark:text-gray-400">+966 56 455 4142</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-gold)' }}>
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 dark:text-gray-200">{t('address')}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{t('addressText')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="brand-heading dark:text-white">{t('workingHours')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">{t('sunday')}</span>
                      <span className="text-gray-600 dark:text-gray-400">{t('hours.weekday')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">{t('monday')}</span>
                      <span className="text-gray-600 dark:text-gray-400">{t('hours.weekday')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">{t('tuesday')}</span>
                      <span className="text-gray-600 dark:text-gray-400">{t('hours.weekday')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">{t('wednesday')}</span>
                      <span className="text-gray-600 dark:text-gray-400">{t('hours.weekday')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">{t('thursday')}</span>
                      <span className="text-gray-600 dark:text-gray-400">{t('hours.weekday')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">{t('friday')}</span>
                      <span className="text-red-600 dark:text-red-400">{t('hours.friday')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">{t('saturday')}</span>
                      <span className="text-gray-600 dark:text-gray-400">{t('hours.weekend')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center dark:text-white">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              {t('success.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t('success.message')}</p>
            <Button onClick={() => setShowSuccessModal(false)} className="btn-primary">
              {t('success.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
