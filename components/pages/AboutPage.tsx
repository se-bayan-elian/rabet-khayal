'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Target, 
  Award, 
  Lightbulb, 
  Heart, 
  Shield, 
  Star, 
  Globe, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

interface AboutPageProps {
  locale: string
}

export default function AboutPage({ locale }: AboutPageProps) {
  const t = useTranslations('about')

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "500+",
      label: t('stats.clients')
    },
    {
      icon: <Target className="w-8 h-8" />,
      number: "1000+",
      label: t('stats.projects')
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "50+",
      label: t('stats.awards')
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: "5+",
      label: t('stats.years')
    }
  ]

  const values = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: t('values.innovation.title'),
      description: t('values.innovation.description')
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: t('values.passion.title'),
      description: t('values.passion.description')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('values.quality.title'),
      description: t('values.quality.description')
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: t('values.excellence.title'),
      description: t('values.excellence.description')
    }
  ]

  const teamMembers = [
    {
      name: t('team.chairman.name'),
      role: t('team.chairman.role'),
      image: t('team.chairman.image'),
      message: t('team.chairman.message'),
      content: t('team.chairman.content')
    },
    {
      name: t('team.generalManager.name'),
      role: t('team.generalManager.role'),
      image: t('team.generalManager.image'),
      message: t('team.generalManager.message'),
      content: t('team.generalManager.content')
    }
  ]

  const milestones = [
    {
      year: "2019",
      title: t('timeline.founding.title'),
      description: t('timeline.founding.description')
    },
    {
      year: "2020",
      title: t('timeline.growth.title'),
      description: t('timeline.growth.description')
    },
    {
      year: "2021",
      title: t('timeline.expansion.title'),
      description: t('timeline.expansion.description')
    },
    {
      year: "2023",
      title: t('timeline.innovation.title'),
      description: t('timeline.innovation.description')
    },
    {
      year: "2024",
      title: t('timeline.present.title'),
      description: t('timeline.present.description')
    }
  ]

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-navy via-brand-navy/90 to-brand-navy/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="mb-6 bg-brand-gold text-brand-navy">
                {t('hero.badge')}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" >
                  {t('hero.portfolio')}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square relative rounded-full overflow-hidden border-4 border-brand-gold/20">
                <Image
                  src="/about-hero.png"
                  alt={t('hero.imageAlt')}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-brand-gold/10 text-brand-navy dark:text-brand-gold">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-brand-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t('story.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>{t('story.paragraph1')}</p>
                <p>{t('story.paragraph2')}</p>
                <p>{t('story.paragraph3')}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  t('story.achievements.innovation'),
                  t('story.achievements.quality'),
                  t('story.achievements.support'),
                  t('story.achievements.growth')
                ].map((achievement, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-story.jpg"
                  alt={t('story.imageAlt')}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('values.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-brand-gold/10 text-brand-navy dark:text-brand-gold">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('timeline.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('timeline.subtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-brand-gold/30 hidden md:block"></div>

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-gold rounded-full border-4 border-white dark:border-gray-900 hidden md:block z-10"></div>

                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Badge className="mb-3 bg-brand-navy text-white">
                        {milestone.year}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('team.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('team.subtitle')}
            </p>
          </div>

          <div className="space-y-16">
            {teamMembers.map((member, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-transparent rounded-2xl"></div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <Badge className="mb-4 bg-brand-gold text-brand-navy text-lg px-4 py-2">
                        {member.role}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-brand-navy dark:text-brand-gold mb-4">
                        {member.message}
                      </h4>
                      <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 leading-relaxed">
                        {member.content.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-brand-navy">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            {t('contact.title')}
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            {t('contact.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy">
              <Mail className="w-5 h-5 mr-2" />
              {t('contact.email')}
            </Button>
            <Button size="lg" variant="outline" >
              <Phone className="w-5 h-5 mr-2" />
              {t('contact.phone')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
