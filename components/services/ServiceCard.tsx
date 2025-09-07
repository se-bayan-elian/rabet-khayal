import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Service } from '@/types/services'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

type ServiceCardProps = {
  service: Service
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const t = useTranslations('services');
  console.log(service);

  return (
    <Link href={`/services/${service.id}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        <div className="relative overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
            {service.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {service.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--brand-navy)' }}>
              {t('projectCount', { count: service.projectCount })}
            </span>
            <Button variant="ghost" size="sm" className="group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform">
              {t('viewDetails')}
              <ArrowRight className="w-4 h-4 ml-2 rtl:hidden" />
              <ArrowLeft className="w-4 h-4 mr-2 ltr:hidden" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>)
}

export default ServiceCard