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
  MapPin,
  Sparkles,
  Zap,
  Rocket,
  TrendingUp,
  Eye,
  Palette,
  Code,
  Layers
} from 'lucide-react'

interface AboutPageProps {
  locale: string
}

export default function AboutPage({ locale }: AboutPageProps) {
  const t = useTranslations('about')
  const tUI = useTranslations('about.ui')

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
      {/* Ultra Creative Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy/90 dark:from-brand-navy dark:via-brand-navy/95 dark:to-brand-navy/90">
          {/* Animated particles */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-brand-gold/30 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-16 w-3 h-3 bg-amber-400/40 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-48 left-1/4 w-2 h-2 bg-brand-gold/50 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-32 right-1/3 w-5 h-5 bg-amber-400/20 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-20 left-16 w-3 h-3 bg-brand-gold/40 rounded-full animate-ping delay-500"></div>
          
          {/* Floating geometric shapes with better positioning */}
          <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-brand-gold/10 to-amber-400/10 rounded-full animate-pulse"></div>
          <div className="absolute top-60 right-32 w-20 h-20 bg-gradient-to-br from-amber-400/15 to-brand-gold/15 rounded-lg rotate-45 animate-bounce delay-1000"></div>
          <div className="absolute bottom-40 left-32 w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-amber-400/20 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-20 w-28 h-28 bg-gradient-to-br from-amber-400/10 to-brand-gold/10 rounded-lg rotate-12 animate-bounce delay-3000"></div>
          
          {/* Enhanced grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50"></div>
          
          {/* Dynamic gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-brand-gold/15 via-amber-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-l from-amber-400/12 via-brand-gold/8 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-gold/8 to-amber-400/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Content - Enhanced */}
            <div className="text-white space-y-10">
              {/* Animated Badge with better styling */}
              <div className="inline-block group">
                <Badge className="mb-6 bg-gradient-to-r mt-10 from-brand-gold via-amber-400 to-brand-gold text-brand-navy text-sm font-bold px-6 py-2 shadow-2xl transform group-hover:scale-105 transition-all ">
                  <Sparkles className="w-5 h-5 me-2 animate-spin" />
                  {t('hero.badge')}
                </Badge>
              </div>

              {/* Enhanced Main Title with better animation */}
              <h1 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-tight">
                <span className="block bg-gradient-to-r py-1 from-white via-brand-gold to-amber-400 bg-clip-text text-transparent ">
                  {t('hero.title')}
                </span>
              </h1>

              {/* Enhanced Subtitle */}
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl font-light">
                {t('hero.subtitle')}
              </p>

              {/* Enhanced Feature highlights */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <Zap className="w-5 h-5" />, text: tUI('features.innovation'), color: "from-yellow-400 to-orange-500" },
                  { icon: <Rocket className="w-5 h-5" />, text: tUI('features.growth'), color: "from-blue-400 to-purple-500" },
                  { icon: <Star className="w-5 h-5" />, text: tUI('features.excellence'), color: "from-green-400 to-teal-500" }
                ].map((feature, index) => (
                  <div key={index} className="group flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <span className="text-sm font-semibold">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Button size="lg" className="group bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold hover:from-brand-gold/90 hover:via-amber-400/90 hover:to-brand-gold/90 text-brand-navy font-bold px-10 py-5 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    {t('hero.cta')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                <Button size="lg" variant="outline" className="group  backdrop-blur-md px-10 py-5 text-lg font-semibold hover:border-white/80 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    {t('hero.portfolio')}
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Right Content - Ultra Enhanced Visual */}
            <div className="relative">
              {/* Main image container with enhanced effects */}
              <div className="relative group">
                {/* Enhanced background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/40 via-amber-400/30 to-brand-gold/40 rounded-3xl blur-3xl scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                
                {/* Main image with enhanced styling */}
                <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-brand-gold/40 shadow-2xl group-hover:border-brand-gold/60 transition-all duration-300">
                  <Image
                    src="/about-hero.png"
                    alt={t('hero.imageAlt')}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Enhanced overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/30 via-transparent to-brand-navy/30 group-hover:from-brand-gold/20 group-hover:to-brand-navy/20 transition-all duration-300"></div>
                </div>

                {/* Enhanced floating elements */}
                <div className="absolute top-8 -right-8 w-20 h-20 bg-gradient-to-br from-brand-gold to-amber-400 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce group-hover:animate-pulse">
                  <TrendingUp className="w-10 h-10 text-brand-navy" />
                </div>
                
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-white/30 to-brand-gold/30 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 shadow-2xl animate-pulse group-hover:animate-bounce">
                  <Eye className="w-12 h-12 text-white" />
                </div>

                <div className="absolute top-1/2 -left-10 w-16 h-16 bg-gradient-to-br from-brand-gold/50 to-amber-400/50 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-brand-gold/60 shadow-xl animate-bounce delay-1000 group-hover:animate-pulse">
                  <Palette className="w-8 h-8 text-brand-navy" />
                </div>

                {/* Additional floating elements */}
                <div className="absolute top-1/4 -right-4 w-12 h-12 bg-gradient-to-br from-amber-400/60 to-brand-gold/60 backdrop-blur-sm rounded-lg flex items-center justify-center border border-amber-400/50 shadow-lg animate-pulse delay-500">
                  <Code className="w-6 h-6 text-white" />
                </div>

                <div className="absolute bottom-1/4 -left-6 w-14 h-14 bg-gradient-to-br from-white/40 to-amber-400/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-lg animate-bounce delay-1500">
                  <Layers className="w-7 h-7 text-brand-navy" />
                </div>
              </div>

              {/* Enhanced Stats overlay */}
              <div className="absolute bottom-10 left-10 right-10 bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="group">
                    <div className="text-3xl font-black text-brand-gold group-hover:scale-110 transition-transform duration-300">500+</div>
                    <div className="text-sm text-gray-200 font-medium">{t('stats.clients')}</div>
                  </div>
                  <div className="group">
                    <div className="text-3xl font-black text-brand-gold group-hover:scale-110 transition-transform duration-300">1000+</div>
                    <div className="text-sm text-gray-200 font-medium">{t('stats.projects')}</div>
                  </div>
                  <div className="group">
                    <div className="text-3xl font-black text-brand-gold group-hover:scale-110 transition-transform duration-300">5+</div>
                    <div className="text-sm text-gray-200 font-medium">{t('stats.years')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium">{tUI('scrollToExplore')}</span>
            <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-4 bg-white/80 rounded-full mt-3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.05)_0%,transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {tUI('ourImpact')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tUI('impactSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="relative">
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-amber-400/10 rounded-3xl scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  
                  <div className="relative p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group-hover:border-brand-gold/30">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-gold/20 to-amber-400/20 text-brand-navy dark:text-brand-gold group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                    <div className="text-4xl md:text-5xl font-black text-brand-gold mb-3 group-hover:scale-105 transition-transform duration-300">
                  {stat.number}
                </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Story Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-brand-navy/5 rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
            <div>
                <Badge className="mb-4 bg-gradient-to-r from-brand-gold/20 to-amber-400/20 text-brand-navy dark:text-brand-gold border border-brand-gold/30">
                  <Code className="w-4 h-4 me-2" />
                  {tUI('ourStory')}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {t('story.title')}
              </h2>
              </div>
              
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p className="relative pl-6 border-l-2 border-brand-gold/30">
                  {t('story.paragraph1')}
                </p>
                <p className="relative pl-6 border-l-2 border-brand-gold/30">
                  {t('story.paragraph2')}
                </p>
                <p className="relative pl-6 border-l-2 border-brand-gold/30">
                  {t('story.paragraph3')}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Lightbulb className="w-5 h-5" />, text: t('story.achievements.innovation') },
                  { icon: <Shield className="w-5 h-5" />, text: t('story.achievements.quality') },
                  { icon: <Heart className="w-5 h-5" />, text: t('story.achievements.support') },
                  { icon: <TrendingUp className="w-5 h-5" />, text: t('story.achievements.growth') }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-brand-gold/10 to-amber-400/10 border border-brand-gold/20 hover:shadow-lg transition-all duration-300">
                    <div className="p-2 rounded-lg bg-brand-gold/20 text-brand-navy dark:text-brand-gold">
                      {achievement.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{achievement.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-full">
              {/* Enhanced image container */}
              <div className="relative group h-full">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/20 to-amber-400/20 rounded-3xl blur-2xl scale-105 group-hover:scale-110 transition-transform duration-500"></div>
                
                {/* Main image */}
                <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 group-hover:border-brand-gold/30 transition-all duration-300">
                <Image
                  src="/rabet-about.png"
                  alt={t('story.imageAlt')}
                  fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/10 via-transparent to-brand-navy/10"></div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-brand-gold to-amber-400 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                  <Layers className="w-6 h-6 text-brand-navy" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-brand-gold/30 shadow-xl">
                  <Star className="w-8 h-8 text-brand-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Values Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,215,0,0.03)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,215,0,0.03)_0%,transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-brand-gold/20 to-amber-400/20 text-brand-navy dark:text-brand-gold border border-brand-gold/30">
              <Heart className="w-4 h-4 me-2" />
              {tUI('ourValues')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('values.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t('values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group">
                <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm group-hover:bg-white/90 dark:group-hover:bg-gray-800/90">
                  <CardContent className="p-8 relative overflow-hidden">
                    {/* Hover background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-gold/20 to-amber-400/20 text-brand-navy dark:text-brand-gold group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                      {value.icon}
                    </div>
                  </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-navy dark:group-hover:text-brand-gold transition-colors duration-300">
                    {value.title}
                  </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                    </div>
                </CardContent>
              </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Timeline Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-brand-gold/20 via-brand-gold/40 to-brand-gold/20 hidden md:block"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.02)_0%,transparent_70%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-brand-gold/20 to-amber-400/20 text-brand-navy dark:text-brand-gold border border-brand-gold/30">
              <Clock className="w-4 h-4 me-2" />
              {tUI('ourJourney')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('timeline.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t('timeline.subtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Enhanced Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-brand-gold/30 via-brand-gold to-brand-gold/30 hidden md:block shadow-lg"></div>

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Enhanced Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-brand-gold to-amber-400 rounded-full border-4 border-white dark:border-gray-900 hidden md:block z-10 shadow-xl">
                  <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-full"></div>
                </div>

                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
                    <CardContent className="p-8 relative overflow-hidden">
                      {/* Hover background effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <Badge className="mb-4 bg-gradient-to-r from-brand-navy to-brand-navy/80 text-white font-semibold px-4 py-2">
                        {milestone.year}
                      </Badge>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-navy dark:group-hover:text-brand-gold transition-colors duration-300">
                        {milestone.title}
                      </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                        {milestone.description}
                      </p>
                      </div>
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

      {/* Enhanced Contact CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy/90 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-gold/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-brand-gold/5 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <div className="space-y-8">
            <div>
              <Badge className="mb-6 bg-gradient-to-r from-brand-gold to-amber-400 text-brand-navy font-semibold px-6 py-3">
                <Mail className="w-4 h-4 me-2" />
                {tUI('getInTouch')}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t('contact.title')}
          </h2>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
            </div>
            
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-brand-gold to-amber-400 hover:from-brand-gold/90 hover:to-amber-400/90 text-brand-navy font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Mail className="w-5 h-5 me-2" />
              {t('contact.email')}
            </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm px-8 py-4 text-lg font-semibold">
              <Phone className="w-5 h-5 me-2" />
              {t('contact.phone')}
            </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
