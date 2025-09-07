import { Calendar, Check, ArrowRight } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { PricingPlan } from '@/types/services'
import { useTranslations } from 'next-intl'

type PricingPlanCardProps = {
  plan: PricingPlan
  onSelect: (planId: string) => void
}

const PricingPlanCard = ({ plan, onSelect }: PricingPlanCardProps) => {
  const t = useTranslations('services.detail')

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${plan.isPopular ? 'border-2 shadow-xl scale-105' : 'hover:scale-105'
        }`}
      style={{
        borderColor: plan.isPopular ? 'var(--brand-gold)' : undefined
      }}
    >
      {plan.isPopular && (
        <div
          className="absolute top-0 right-6 transform -translate-y-1/2 px-4 py-1 rounded-full text-sm font-bold text-white"
          style={{ background: 'var(--brand-gold)' }}
        >
          {t('popular')}
        </div>
      )}

      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-2 brand-heading">{plan.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            {plan.originalPrice !== plan.finalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${plan.originalPrice}
              </span>
            )}
            <span className="text-4xl font-bold" style={{ color: 'var(--brand-navy)' }}>
              ${plan.finalPrice}
            </span>
          </div>
          <span className="text-gray-600">/{plan.billingPeriod}</span>
        </div>

        <div className="space-y-3 mb-6">
          {plan.deliveryDays && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>{t('deliveryTime', { days: plan.deliveryDays })}</span>
            </div>
          )}
          {plan.revisions && (
            <div className="flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-green-500" />
              <span>{t('revisions', { count: plan.revisions })}</span>
            </div>
          )}
          {plan.features?.map((feature) => (
            <div key={feature.id} className="flex items-start gap-2 text-sm">
              <Check className={`w-4 h-4 shrink-0 mt-0.5 ${feature.isIncluded ? 'text-green-500' : 'text-red-500'
                }`} />
              <span className={feature.isIncluded ? '' : 'line-through text-gray-400'}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>

        <Button
          className="w-full btn-primary"
          onClick={() => onSelect(plan.id)}
        >
          {t('selectPlan')}
        </Button>
      </CardContent>
    </Card>
  )
}

export default PricingPlanCard
