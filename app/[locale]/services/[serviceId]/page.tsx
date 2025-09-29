import ServicePage from '@/components/pages/SingleServicePage'
import { fetchServiceById } from '@/services/services'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    serviceId: string
    locale: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const service = await fetchServiceById(params.serviceId)
    
    if (!service) {
      return {
        title: 'Service Not Found',
        description: 'The requested service could not be found.'
      }
    }

    const isArabic = params.locale === 'ar'
    const title = `${service.name} | Rabet Alkhayal`
    const description = service.description?.replace(/<[^>]*>/g, '').substring(0, 160) || 
      `${service.name} - Professional service from Rabet Alkhayal`

    return {
      title,
      description,
      keywords: isArabic 
        ? `خدمة ${service.name}, ربط الخيال, خدمات احترافية`
        : `${service.name} service, Rabet Alkhayal, professional services`,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: isArabic ? 'ar_SA' : 'en_US',
        url: `https://rabet-alkhayal.com/${params.locale}/services/${params.serviceId}`,
        siteName: 'Rabet Alkhayal',
        images: service.image ? [
          {
            url: service.image,
            width: 1200,
            height: 630,
            alt: service.name,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: service.image ? [service.image] : [],
      },
      alternates: {
        canonical: `https://rabet-alkhayal.com/${params.locale}/services/${params.serviceId}`,
        languages: {
          'en': `https://rabet-alkhayal.com/en/services/${params.serviceId}`,
          'ar': `https://rabet-alkhayal.com/ar/services/${params.serviceId}`,
        },
      },
    }
  } catch (error) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.'
    }
  }
}

export default async function page({ params }: PageProps) {
  try {
    // Prefetch the service data
    const service = await fetchServiceById(params.serviceId)
    
    if (!service) {
      notFound()
    }

    return <ServicePage />
  } catch (error) {
    notFound()
  }
}