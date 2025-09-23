"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Scale,
  Shield,
  CreditCard,
  Truck,
  RefreshCw,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const t = useTranslations('terms');
  const router = useRouter();

  const sections = [
    {
      id: 'acceptance',
      icon: Scale,
      title: t('sections.acceptance.title'),
      content: t('sections.acceptance.content'),
    },
    {
      id: 'services',
      icon: FileText,
      title: t('sections.services.title'),
      content: t('sections.services.content'),
    },
    {
      id: 'accounts',
      icon: Shield,
      title: t('sections.accounts.title'),
      content: t('sections.accounts.content'),
    },
    {
      id: 'orders',
      icon: CreditCard,
      title: t('sections.orders.title'),
      content: t('sections.orders.content'),
    },
    {
      id: 'shipping',
      icon: Truck,
      title: t('sections.shipping.title'),
      content: t('sections.shipping.content'),
    },
    {
      id: 'returns',
      icon: RefreshCw,
      title: t('sections.returns.title'),
      content: t('sections.returns.content'),
    },
    {
      id: 'liability',
      icon: AlertTriangle,
      title: t('sections.liability.title'),
      content: t('sections.liability.content'),
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-900" style={{ background: 'var(--brand-bg)' }}>
      <div className="section-padding">
        <div className="section-container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold brand-heading mb-4 text-brand-navy dark:!text-gray-200">{t('title')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              {t('subtitle')}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{t('lastUpdated')}: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-brand-navy dark:!text-gray-200">{t('tableOfContents')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                          <section.icon className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400">{section.title}</span>
                      </a>
                    ))}
                    <Separator className="my-4" />
                    <a
                      href="#contact"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm group"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                      <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('contact.title')}</span>
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Introduction */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                      {t('introduction')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sections */}
              {sections.map((section, index) => (
                <Card key={section.id} id={section.id} className="scroll-mt-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl text-brand-navy dark:!text-gray-200">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      {index + 1}. {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Contact Information */}
              <Card id="contact" className="scroll-mt-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-brand-navy dark:!text-gray-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    {t('contact.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-brand-navy dark:!text-gray-200">{t('contact.legal.title')}</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{t('contact.legal.email')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{t('contact.legal.phone')}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-brand-navy dark:!text-gray-200">{t('contact.support.title')}</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{t('contact.support.email')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{t('contact.support.phone')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h4 className="font-semibold mb-3 text-brand-navy dark:!text-gray-200">{t('contact.address.title')}</h4>
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{t('contact.address.full')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('goBack')}
                </Button>
                <Button onClick={() => router.push('/contact')} className="btn-primary">
                  <span>{t('contactUs')}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
