'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, Palette, BarChart3, Zap, Shield, Users, Heart, Star, CheckCircle, Globe, Smartphone, Monitor, PenTool, Camera, Megaphone, Target, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ProductsPage = () => {
  const t = useTranslations('products');

  const services = [
    {
      category: t('categories.webDevelopment.title'),
      icon: <Code className="w-8 h-8" />,
      description: t('categories.webDevelopment.description'),
      services: [
        { 
          name: t('categories.webDevelopment.services.companyWebsites.name'), 
          price: t('categories.webDevelopment.services.companyWebsites.price'), 
          features: [
            t('categories.webDevelopment.services.companyWebsites.features.professionalDesign'),
            t('categories.webDevelopment.services.companyWebsites.features.responsive'),
            t('categories.webDevelopment.services.companyWebsites.features.adminPanel'),
            t('categories.webDevelopment.services.companyWebsites.features.seoOptimized')
          ] 
        },
        { 
          name: t('categories.webDevelopment.services.ecommerce.name'), 
          price: t('categories.webDevelopment.services.ecommerce.price'), 
          features: [
            t('categories.webDevelopment.services.ecommerce.features.securePayment'),
            t('categories.webDevelopment.services.ecommerce.features.inventoryManagement'),
            t('categories.webDevelopment.services.ecommerce.features.orderTracking'),
            t('categories.webDevelopment.services.ecommerce.features.detailedAnalytics')
          ] 
        },
        { 
          name: t('categories.webDevelopment.services.customWebsites.name'), 
          price: t('categories.webDevelopment.services.customWebsites.price'), 
          features: [
            t('categories.webDevelopment.services.customWebsites.features.innovativeSolutions'),
            t('categories.webDevelopment.services.customWebsites.features.modernTechnologies'),
            t('categories.webDevelopment.services.customWebsites.features.highPerformance'),
            t('categories.webDevelopment.services.customWebsites.features.ongoingSupport')
          ] 
        }
      ]
    },
    {
      category: t('categories.designAndBranding.title'),
      icon: <Palette className="w-8 h-8" />,
      description: t('categories.designAndBranding.description'),
      services: [
        { 
          name: t('categories.designAndBranding.services.visualIdentity.name'), 
          price: t('categories.designAndBranding.services.visualIdentity.price'), 
          features: [
            t('categories.designAndBranding.services.visualIdentity.features.professionalLogo'),
            t('categories.designAndBranding.services.visualIdentity.features.identityGuide'),
            t('categories.designAndBranding.services.visualIdentity.features.designTemplates'),
            t('categories.designAndBranding.services.visualIdentity.features.colorsAndFonts')
          ] 
        },
        { 
          name: t('categories.designAndBranding.services.printDesign.name'), 
          price: t('categories.designAndBranding.services.printDesign.price'), 
          features: [
            t('categories.designAndBranding.services.printDesign.features.businessCards'),
            t('categories.designAndBranding.services.printDesign.features.brochures'),
            t('categories.designAndBranding.services.printDesign.features.banners'),
            t('categories.designAndBranding.services.printDesign.features.advertisingMaterials')
          ] 
        },
        { 
          name: t('categories.designAndBranding.services.interfaceDesign.name'), 
          price: t('categories.designAndBranding.services.interfaceDesign.price'), 
          features: [
            t('categories.designAndBranding.services.interfaceDesign.features.uiUxDesign'),
            t('categories.designAndBranding.services.interfaceDesign.features.interactivePrototypes'),
            t('categories.designAndBranding.services.interfaceDesign.features.userTesting'),
            t('categories.designAndBranding.services.interfaceDesign.features.experienceOptimization')
          ] 
        }
      ]
    },
    {
      category: t('categories.digitalMarketing.title'),
      icon: <BarChart3 className="w-8 h-8" />,
      description: t('categories.digitalMarketing.description'),
      services: [
        { 
          name: t('categories.digitalMarketing.services.socialMediaManagement.name'), 
          price: t('categories.digitalMarketing.services.socialMediaManagement.price'), 
          features: [
            t('categories.digitalMarketing.services.socialMediaManagement.features.contentCreation'),
            t('categories.digitalMarketing.services.socialMediaManagement.features.postScheduling'),
            t('categories.digitalMarketing.services.socialMediaManagement.features.customerInteraction'),
            t('categories.digitalMarketing.services.socialMediaManagement.features.performanceAnalysis')
          ] 
        },
        { 
          name: t('categories.digitalMarketing.services.googleAds.name'), 
          price: t('categories.digitalMarketing.services.googleAds.price'), 
          features: [
            t('categories.digitalMarketing.services.googleAds.features.keywordResearch'),
            t('categories.digitalMarketing.services.googleAds.features.campaignCreation'),
            t('categories.digitalMarketing.services.googleAds.features.adOptimization'),
            t('categories.digitalMarketing.services.googleAds.features.comprehensiveReports')
          ] 
        },
        { 
          name: t('categories.digitalMarketing.services.seo.name'), 
          price: t('categories.digitalMarketing.services.seo.price'), 
          features: [
            t('categories.digitalMarketing.services.seo.features.siteAnalysis'),
            t('categories.digitalMarketing.services.seo.features.contentOptimization'),
            t('categories.digitalMarketing.services.seo.features.linkBuilding'),
            t('categories.digitalMarketing.services.seo.features.rankingMonitoring')
          ] 
        }
      ]
    },
    {
      category: t('categories.mobileApps.title'),
      icon: <Smartphone className="w-8 h-8" />,
      description: t('categories.mobileApps.description'),
      services: [
        { 
          name: t('categories.mobileApps.services.businessApps.name'), 
          price: t('categories.mobileApps.services.businessApps.price'), 
          features: [
            t('categories.mobileApps.services.businessApps.features.managementSystem'),
            t('categories.mobileApps.services.businessApps.features.financialReports'),
            t('categories.mobileApps.services.businessApps.features.smartNotifications'),
            t('categories.mobileApps.services.businessApps.features.highSecurity')
          ] 
        },
        { 
          name: t('categories.mobileApps.services.ecommerceApps.name'), 
          price: t('categories.mobileApps.services.ecommerceApps.price'), 
          features: [
            t('categories.mobileApps.services.ecommerceApps.features.storeInterface'),
            t('categories.mobileApps.services.ecommerceApps.features.paymentSystem'),
            t('categories.mobileApps.services.ecommerceApps.features.orderTracking'),
            t('categories.mobileApps.services.ecommerceApps.features.loyaltyProgram')
          ] 
        },
        { 
          name: t('categories.mobileApps.services.customApps.name'), 
          price: t('categories.mobileApps.services.customApps.price'), 
          features: [
            t('categories.mobileApps.services.customApps.features.innovativeIdea'),
            t('categories.mobileApps.services.customApps.features.advancedTechnologies'),
            t('categories.mobileApps.services.customApps.features.comprehensiveTesting'),
            t('categories.mobileApps.services.customApps.features.storePublishing')
          ] 
        }
      ]
    },
    {
      category: t('categories.technicalConsulting.title'),
      icon: <Users className="w-8 h-8" />,
      description: t('categories.technicalConsulting.description'),
      services: [
        { 
          name: t('categories.technicalConsulting.services.businessAnalysis.name'), 
          price: t('categories.technicalConsulting.services.businessAnalysis.price'), 
          features: [
            t('categories.technicalConsulting.services.businessAnalysis.features.needsStudy'),
            t('categories.technicalConsulting.services.businessAnalysis.features.marketAnalysis'),
            t('categories.technicalConsulting.services.businessAnalysis.features.implementationPlan'),
            t('categories.technicalConsulting.services.businessAnalysis.features.growthProjections')
          ] 
        },
        { 
          name: t('categories.technicalConsulting.services.cybersecurity.name'), 
          price: t('categories.technicalConsulting.services.cybersecurity.price'), 
          features: [
            t('categories.technicalConsulting.services.cybersecurity.features.vulnerabilityScanning'),
            t('categories.technicalConsulting.services.cybersecurity.features.protectionPlan'),
            t('categories.technicalConsulting.services.cybersecurity.features.staffTraining'),
            t('categories.technicalConsulting.services.cybersecurity.features.continuousMonitoring')
          ] 
        },
        { 
          name: t('categories.technicalConsulting.services.digitalTransformation.name'), 
          price: t('categories.technicalConsulting.services.digitalTransformation.price'), 
          features: [
            t('categories.technicalConsulting.services.digitalTransformation.features.currentStateAssessment'),
            t('categories.technicalConsulting.services.digitalTransformation.features.transformationStrategy'),
            t('categories.technicalConsulting.services.digitalTransformation.features.technologyImplementation'),
            t('categories.technicalConsulting.services.digitalTransformation.features.resultsMeasurement')
          ] 
        }
      ]
    }
  ];

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: t('features.highSecurity.title'), desc: t('features.highSecurity.description') },
    { icon: <Zap className="w-6 h-6" />, title: t('features.fastPerformance.title'), desc: t('features.fastPerformance.description') },
    { icon: <Heart className="w-6 h-6" />, title: t('features.continuousSupport.title'), desc: t('features.continuousSupport.description') },
    { icon: <Star className="w-6 h-6" />, title: t('features.highQuality.title'), desc: t('features.highQuality.description') }
  ];

  return (
    <div className="pt-20 bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-brand-gold/10 dark:bg-brand-gold/20 text-brand-navy dark:text-brand-gold border border-brand-gold/20 dark:border-brand-gold/30">
            <Star className="w-5 h-5" />
            <span className="font-semibold">{t('hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-brand-navy dark:text-white">
            {t('hero.title')}
          </h1>

          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 flex items-center gap-4 hover:scale-105 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex-shrink-0 p-3 rounded-full bg-brand-gold/10 dark:bg-brand-gold/20">
                  <div className="text-brand-navy dark:text-brand-gold">{feature.icon}</div>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg text-brand-navy dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8">
            {services.map((category, categoryIndex) => (
              <div key={categoryIndex} className="fade-in">
                {/* Category Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-4 mb-4">
                    <div className="p-4 rounded-full bg-brand-gold/10 dark:bg-brand-gold/20 text-brand-navy dark:text-brand-gold border border-brand-gold/20 dark:border-brand-gold/30">
                      {category.icon}
                    </div>
                    <div className="text-right">
                      <h2 className="text-3xl font-bold text-brand-navy dark:text-white">{category.category}</h2>
                      <p className="text-lg text-gray-600 dark:text-gray-300">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Services Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {category.services.map((service, serviceIndex) => (
                    <Card key={serviceIndex} className="bg-white dark:bg-gray-800 hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl dark:border-gray-700">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold text-brand-navy dark:text-white">{service.name}</CardTitle>
                        <div className="text-2xl font-bold text-brand-gold dark:text-brand-gold">{service.price}</div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-3">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 flex-shrink-0 text-brand-gold dark:text-brand-gold" />
                              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="btn-creative w-full mt-6">
                          {t('cta.requestService')}
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl relative overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-brand-gold"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-brand-navy"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 text-brand-navy dark:text-white">
                {t('cta.title')}
              </h2>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="btn-creative px-10 py-4 text-lg font-bold">
                  <Users className="w-6 h-6 mr-3" />
                  {t('cta.freeConsultation')}
                </Button>
                <Button size="lg" variant="outline" className="px-10 py-4 text-lg font-bold border-2 border-brand-gold text-brand-navy dark:text-brand-gold hover:bg-brand-gold/10 dark:hover:bg-brand-gold/20">
                  {t('cta.contactUs')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
