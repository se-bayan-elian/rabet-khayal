"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Eye,
  Database,
  Lock,
  UserCheck,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Users,
  Globe,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacy');
  const router = useRouter();

  const sections = [
    {
      id: 'introduction',
      icon: Info,
      title: t('sections.introduction.title'),
      content: t('sections.introduction.content'),
    },
    {
      id: 'dataCollection',
      icon: Database,
      title: t('sections.dataCollection.title'),
      content: t('sections.dataCollection.content'),
    },
    {
      id: 'dataUsage',
      icon: Settings,
      title: t('sections.dataUsage.title'),
      content: t('sections.dataUsage.content'),
    },
    {
      id: 'dataSharing',
      icon: Users,
      title: t('sections.dataSharing.title'),
      content: t('sections.dataSharing.content'),
    },
    {
      id: 'dataSecurity',
      icon: Lock,
      title: t('sections.dataSecurity.title'),
      content: t('sections.dataSecurity.content'),
    },
    {
      id: 'userRights',
      icon: UserCheck,
      title: t('sections.userRights.title'),
      content: t('sections.userRights.content'),
    },
    {
      id: 'cookies',
      icon: FileText,
      title: t('sections.cookies.title'),
      content: t('sections.cookies.content'),
    },
    {
      id: 'thirdParty',
      icon: Globe,
      title: t('sections.thirdParty.title'),
      content: t('sections.thirdParty.content'),
    },
    {
      id: 'dataRetention',
      icon: Calendar,
      title: t('sections.dataRetention.title'),
      content: t('sections.dataRetention.content'),
    },
    {
      id: 'children',
      icon: Shield,
      title: t('sections.children.title'),
      content: t('sections.children.content'),
    },
    {
      id: 'changes',
      icon: AlertTriangle,
      title: t('sections.changes.title'),
      content: t('sections.changes.content'),
    },
  ];

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--brand-bg)' }}>
      <div className="section-padding">
        <div className="section-container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold brand-heading mb-4">{t('title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {t('subtitle')}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{t('lastUpdated')}: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">{t('tableOfContents')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                          <section.icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <span className="group-hover:text-blue-600">{section.title}</span>
                      </a>
                    ))}
                    <Separator className="my-4" />
                    <a
                      href="#contact"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm group"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                        <Mail className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <span className="group-hover:text-blue-600">{t('contact.title')}</span>
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Introduction */}
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {t('introduction')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sections */}
              {sections.map((section, index) => (
                <Card key={section.id} id={section.id} className="scroll-mt-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      {index + 1}. {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Contact Information */}
              <Card id="contact" className="scroll-mt-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
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
                      <h4 className="font-semibold mb-3">{t('contact.privacy.title')}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{t('contact.privacy.email')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{t('contact.privacy.phone')}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{t('contact.support.title')}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
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
                    <h4 className="font-semibold mb-3">{t('contact.address.title')}</h4>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
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
