import { Header } from "@/components/header"
import { HeroCarousel } from "@/components/hero-carousel"
import { CreativeProducts } from "@/components/creative-products"
import { CompanyStats } from "@/components/company-stats"
import { ServicesOverview } from "@/components/services-overview"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const heroT = useTranslations('hero')
  const productsT = useTranslations('products')
  const statsT = useTranslations('stats')
  const servicesT = useTranslations('services')

  return (

    <div className="pt-20">
      <HeroCarousel
        title={heroT('title')}
        subtitle={heroT('subtitle')}
        cta={heroT('cta')}
      />
      <CreativeProducts
        title={productsT('title')}
        subtitle={productsT('subtitle')}
      />
      <CompanyStats
        clients={statsT('clients')}
        projects={statsT('projects')}
        coffee={statsT('coffee')}
        satisfaction={statsT('satisfaction')}
      />
      <ServicesOverview
        title={servicesT('title')}
        subtitle={servicesT('subtitle')}
      />
      <Testimonials />
    </div>

  )
}
