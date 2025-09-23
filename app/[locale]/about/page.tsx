import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import AboutPage from '@/components/pages/AboutPage'
import { generateMetadata as generateMeta, generateAlternateLanguages, generateOrganizationJsonLd, generateJsonLd } from '@/lib/metadata'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata.about' })
  
  return generateMeta({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(',').map(k => k.trim()),
    locale,
    ogType: 'website',
    alternates: {
      languages: generateAlternateLanguages(locale, '/about')
    }
  })
}

export default function About({ params: { locale } }: Props) {
  // Generate JSON-LD structured data
  const organizationJsonLd = generateOrganizationJsonLd(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(organizationJsonLd)}
      />
      <AboutPage locale={locale} />
    </>
  )
}
