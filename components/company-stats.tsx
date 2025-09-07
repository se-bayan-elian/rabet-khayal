"use client"

import React from "react"
import { useTranslations } from 'next-intl'

interface CompanyStatsProps {
  clients: string
  projects: string
  coffee: string
  satisfaction: string
}

export function CompanyStats({
  clients,
  projects,
  coffee,
  satisfaction
}: CompanyStatsProps) {
  const t = useTranslations('stats')
  return (
    <section className="section-padding" style={{ background: 'var(--brand-accent)' }}>
      <div className="section-container">
        <h2 className="text-4xl font-bold text-center mb-16" style={{ color: 'var(--brand-navy)' }}>
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center p-8 card-elegant">
            <div className="text-5xl font-bold mb-4"
              style={{ color: 'var(--brand-gold)' }}>150+</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-navy)' }}>{projects}</h3>
            <p className="text-gray-600">{t('description.projects')}</p>
          </div>

          <div className="text-center p-8 card-elegant">
            <div className="text-5xl font-bold mb-4"
              style={{ color: 'var(--brand-gold)' }}>98%</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-navy)' }}>{satisfaction}</h3>
            <p className="text-gray-600">{t('description.satisfaction')}</p>
          </div>

          <div className="text-center p-8 card-elegant">
            <div className="text-5xl font-bold mb-4"
              style={{ color: 'var(--brand-gold)' }}>50+</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-navy)' }}>{clients}</h3>
            <p className="text-gray-600">{t('description.clients')}</p>
          </div>

          <div className="text-center p-8 card-elegant">
            <div className="text-5xl font-bold mb-4"
              style={{ color: 'var(--brand-gold)' }}>5+</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-navy)' }}>{t('experience')}</h3>
            <p className="text-gray-600">{t('description.experience')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
