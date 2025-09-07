"use client"

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, AlertTriangle, RotateCw, Home, Inbox } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import ServiceCardSkeleton from '@/components/services/ServiceCardSkeleton'
import { fetchServices } from '@/services/services'
import { ServicesResponse } from '@/types/services'
import EmptyServiceCard from '../services/EmptyServiceCard'
import ServiceCard from '../services/ServiceCard'
import ServiceErrorCard from '../services/ServiceErrorCard'
import ServiceHeroSection from '../services/ServiceHeroSection'

export default function ServicesPage() {
  const t = useTranslations('services')
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10

  const { data, isLoading, isError, error } = useQuery<ServicesResponse, Error>({
    queryKey: ['services', { page, limit }],
    queryFn: () => fetchServices({ page, limit }),
    staleTime: 5000
  })

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    router.push(`/services?page=${newPage}&limit=${limit}`)
  }

  // Error state
  if (isError) {
    return (
      <ServiceErrorCard error={error} />
    )
  }

  return (
    <div className="pt-20">
      <section className="section-padding" style={{ background: 'var(--brand-bg)' }}>
        <div className="section-container">
          <ServiceHeroSection />

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Loading state with skeletons
              Array.from({ length: limit }).map((_, index) => (
                <ServiceCardSkeleton key={index} />
              ))
            ) : !data?.data?.length ? (
              // No services found state
              <EmptyServiceCard />
            ) : (
              // Services list
              data.data.map((service) => (
                <ServiceCard service={service} key={service.id} />
              ))
            )}
          </div>

          {/* Pagination */}
          {data?.meta && !isLoading && (
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => handlePageChange(data.meta.page - 1)}
                disabled={!data.meta.hasPreviousPage || isLoading}
                variant="outline"
              >
                {t('previous')}
              </Button>
              {Array.from({ length: data.meta.totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  variant={data.meta.page === i + 1 ? "default" : "outline"}
                  disabled={isLoading}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                onClick={() => handlePageChange(data.meta.page + 1)}
                disabled={!data.meta.hasNextPage || isLoading}
                variant="outline"
              >
                {t('next')}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
