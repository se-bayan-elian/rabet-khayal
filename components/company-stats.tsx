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
    <section className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="section-container">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-2">
          <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl font-bold mb-4 text-amber-600 dark:text-amber-400">150+</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{projects}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('description.projects')}</p>
          </div>

          <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl font-bold mb-4 text-amber-600 dark:text-amber-400">98%</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{satisfaction}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('description.satisfaction')}</p>
          </div>

          <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl font-bold mb-4 text-amber-600 dark:text-amber-400">50+</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{clients}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('description.clients')}</p>
          </div>

          <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl font-bold mb-4 text-amber-600 dark:text-amber-400">5+</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('experience')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('description.experience')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
