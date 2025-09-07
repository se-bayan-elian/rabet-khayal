import { Heart, Shield, Star, Zap } from 'lucide-react';
import React from 'react'
import { useTranslations } from 'next-intl'

const ServiceHeroSection = () => {
  const t = useTranslations('serviceHero')
  const tServices = useTranslations('services')

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('features.security.title'),
      desc: t('features.security.desc')
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('features.performance.title'),
      desc: t('features.performance.desc')
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: t('features.support.title'),
      desc: t('features.support.desc')
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: t('features.quality.title'),
      desc: t('features.quality.desc')
    }
  ];
  return (
    <section className="text-center">
      <div className=" mx-auto">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
          style={{ background: 'var(--brand-accent)', color: 'var(--brand-navy)' }}>
          <Star className="w-5 h-5" />
          <span className="font-semibold">{tServices('title')}</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--brand-navy)' }}>
          {t('title.start')} <span className="brand-text">{t('title.highlight')}</span>
          <br />{t('title.end')}
        </h1>

        <p className="text-xl mb-10 max-w-3xl mx-auto" style={{ color: 'var(--brand-gray)' }}>
          {t('description')}
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card-elegant p-6 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
              <div className="flex-shrink-0 p-3 rounded-full" style={{ background: 'var(--brand-accent)' }}>
                <div style={{ color: 'var(--brand-navy)' }}>{feature.icon}</div>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg" style={{ color: 'var(--brand-navy)' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: 'var(--brand-gray)' }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>)
}

export default ServiceHeroSection