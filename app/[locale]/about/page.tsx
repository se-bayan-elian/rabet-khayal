"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Globe,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    {
      icon: Heart,
      title: t('values.quality.title'),
      description: t('values.quality.description'),
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Users,
      title: t('values.customer.title'),
      description: t('values.customer.description'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Lightbulb,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Globe,
      title: t('values.sustainability.title'),
      description: t('values.sustainability.description'),
      color: 'bg-green-100 text-green-600',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: t('timeline.founded.title'),
      description: t('timeline.founded.description'),
    },
    {
      year: '2021',
      title: t('timeline.expansion.title'),
      description: t('timeline.expansion.description'),
    },
    {
      year: '2022',
      title: t('timeline.recognition.title'),
      description: t('timeline.recognition.description'),
    },
    {
      year: '2023',
      title: t('timeline.growth.title'),
      description: t('timeline.growth.description'),
    },
    {
      year: '2024',
      title: t('timeline.innovation.title'),
      description: t('timeline.innovation.description'),
    },
  ];

  const stats = [
    {
      number: '10,000+',
      label: t('stats.customers'),
      icon: Users,
    },
    {
      number: '500+',
      label: t('stats.projects'),
      icon: Award,
    },
    {
      number: '15+',
      label: t('stats.countries'),
      icon: Globe,
    },
    {
      number: '99%',
      label: t('stats.satisfaction'),
      icon: Star,
    },
  ];

  const team = [
    {
      name: 'أحمد محمد',
      role: t('team.ceo'),
      image: '/team/ceo.jpg',
      bio: t('team.ceo_bio'),
    },
    {
      name: 'فاطمة علي',
      role: t('team.cto'),
      image: '/team/cto.jpg',
      bio: t('team.cto_bio'),
    },
    {
      name: 'سارة أحمد',
      role: t('team.designer'),
      image: '/team/designer.jpg',
      bio: t('team.designer_bio'),
    },
    {
      name: 'محمد عبدالله',
      role: t('team.developer'),
      image: '/team/developer.jpg',
      bio: t('team.developer_bio'),
    },
  ];

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--brand-bg)' }}>
      {/* Hero Section */}
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold brand-heading mb-6">{t('hero.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold brand-heading mb-2" style={{ color: 'var(--brand-navy)' }}>
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    {t('mission.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {t('mission.description')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                    {t('vision.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {t('vision.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold brand-heading mb-6">{t('values.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${value.color}`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 brand-heading">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold brand-heading mb-6">{t('timeline.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('timeline.subtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 to-purple-200"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="mb-3">
                        <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                          {milestone.year}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 brand-heading">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full border-4 border-white shadow-lg"
                      style={{ background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-navy))' }}>
                    </div>
                  </div>

                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold brand-heading mb-6">{t('team.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('team.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for team member photos */}
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-1 brand-heading">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="section-container text-center">
          <h2 className="text-4xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/contact">
                <Mail className="w-5 h-5 mr-2" />
                {t('cta.contact')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/services">
                <ArrowRight className="w-5 h-5 mr-2" />
                {t('cta.services')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
