import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    type?: 'website' | 'article' | 'product'
    url?: string
    siteName?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    site?: string
    creator?: string
    title?: string
    description?: string
    images?: string[]
  }
  robots?: {
    index?: boolean
    follow?: boolean
    googleBot?: {
      index?: boolean
      follow?: boolean
      'max-video-preview'?: number
      'max-image-preview'?: 'none' | 'standard' | 'large'
      'max-snippet'?: number
    }
  }
  alternates?: {
    canonical?: string
    languages?: Record<string, string>
  }
  other?: Record<string, string>
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
const defaultImage = `${baseUrl}/m-logo.png`

export function generateMetadata(config: SEOConfig, locale: string = 'ar'): Metadata {
  const {
    title,
    description,
    keywords,
    canonical,
    openGraph,
    twitter,
    robots,
    alternates,
    other
  } = config

  const fullTitle = title.includes('ربط الخيال') || title.includes('Rabet Alkhayal') 
    ? title 
    : `${title} | ${locale === 'ar' ? 'ربط الخيال' : 'Rabet Alkhayal'}`

  const canonicalUrl = canonical || `${baseUrl}/${locale}`
  const ogImage = openGraph?.images?.[0]?.url || defaultImage

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: 'Rabet Alkhayal Team' }],
    creator: 'Rabet Alkhayal',
    publisher: 'Rabet Alkhayal',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ar': `${baseUrl}/ar`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/ar`,
      },
      ...alternates?.languages
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
      ...robots
    },
    openGraph: {
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      url: openGraph?.url || canonicalUrl,
      siteName: openGraph?.siteName || (locale === 'ar' ? 'ربط الخيال' : 'Rabet Alkhayal'),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: openGraph?.images?.[0]?.alt || fullTitle,
        },
        ...(openGraph?.images?.slice(1) || [])
      ],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: openGraph?.type || 'website',
    },
    twitter: {
      card: twitter?.card || 'summary_large_image',
      site: twitter?.site || '@rabetalkhayal',
      creator: twitter?.creator || '@rabetalkhayal',
      title: twitter?.title || fullTitle,
      description: twitter?.description || description,
      images: twitter?.images || [ogImage],
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
      other: {
        'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION || '',
      },
    },
    category: 'technology',
    classification: 'Business',
    other: {
      'application-name': 'Rabet Alkhayal',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Rabet Alkhayal',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#1e40af',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#1e40af',
      ...other
    }
  }
}

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    ar: {
      title: 'ربط الخيال - منصة المنتجات والخدمات الإبداعية',
      description: 'اكتشف أفضل المنتجات والخدمات الإبداعية والتقنية عالية الجودة. منصة ربط الخيال توفر لك حلول مبتكرة ومتنوعة لجميع احتياجاتك.',
      keywords: 'منتجات إبداعية, خدمات تقنية, تصميم, تطوير, تسوق, ربط الخيال',
    },
    en: {
      title: 'Rabet Alkhayal - Creative Products & Services Platform',
      description: 'Discover the best high-quality creative and technical products and services. Rabet Alkhayal platform provides innovative and diverse solutions for all your needs.',
      keywords: 'creative products, technical services, design, development, shopping, rabet alkhayal',
    }
  },
  products: {
    ar: {
      title: 'المنتجات - ربط الخيال',
      description: 'تصفح مجموعتنا المتنوعة من المنتجات الإبداعية عالية الجودة. منتجات مصممة بعناية لتلبية احتياجاتك المختلفة.',
      keywords: 'منتجات, تسوق, إبداع, جودة, تصميم',
    },
    en: {
      title: 'Products - Rabet Alkhayal',
      description: 'Browse our diverse collection of high-quality creative products. Carefully designed products to meet your different needs.',
      keywords: 'products, shopping, creative, quality, design',
    }
  },
  services: {
    ar: {
      title: 'الخدمات - ربط الخيال',
      description: 'استكشف خدماتنا التقنية والإبداعية المتخصصة. فريق من الخبراء لتحويل أفكارك إلى واقع ملموس.',
      keywords: 'خدمات, تقنية, إبداع, تطوير, تصميم',
    },
    en: {
      title: 'Services - Rabet Alkhayal',
      description: 'Explore our specialized technical and creative services. A team of experts to turn your ideas into tangible reality.',
      keywords: 'services, technical, creative, development, design',
    }
  },
  about: {
    ar: {
      title: 'من نحن - ربط الخيال',
      description: 'تعرف على ربط الخيال، شريكك الموثوق للمنتجات والخدمات الإبداعية والتقنية عالية الجودة. اكتشف مهمتنا وقيمنا والتزامنا بالتميز.',
      keywords: 'من نحن, شركة, مهمة, قيم, فريق, جودة, خدمات, منتجات',
    },
    en: {
      title: 'About Us - Rabet Alkhayal',
      description: 'Learn about Rabet Alkhayal, your trusted partner for high-quality creative and technical products and services. Discover our mission, values, and commitment to excellence.',
      keywords: 'about us, company, mission, values, team, quality, services, products',
    }
  },
  contact: {
    ar: {
      title: 'اتصل بنا - ربط الخيال',
      description: 'تواصل معنا للحصول على المساعدة والدعم. فريقنا جاهز للإجابة على استفساراتك وتقديم أفضل الخدمات.',
      keywords: 'اتصل بنا, تواصل, دعم, مساعدة, خدمة العملاء',
    },
    en: {
      title: 'Contact Us - Rabet Alkhayal',
      description: 'Contact us for help and support. Our team is ready to answer your inquiries and provide the best services.',
      keywords: 'contact us, communication, support, help, customer service',
    }
  }
}

// Helper function to get SEO config for a specific page and locale
export function getSEOConfig(page: keyof typeof seoConfigs, locale: string = 'ar') {
  return seoConfigs[page][locale as 'ar' | 'en'] || seoConfigs[page].ar
}

// Helper function to generate structured data
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Product' | 'Service', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        name: 'Rabet Alkhayal',
        alternateName: 'ربط الخيال',
        url: baseUrl,
        logo: `${baseUrl}/m-logo.png`,
        description: 'منصة متكاملة للمنتجات والخدمات الإبداعية والتقنية عالية الجودة',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'SA',
          addressRegion: 'Riyadh'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Arabic', 'English']
        },
        sameAs: [
          // Add social media URLs here
        ],
        ...data
      }
    
    case 'WebSite':
      return {
        ...baseStructuredData,
        name: 'Rabet Alkhayal',
        alternateName: 'ربط الخيال',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        ...data
      }
    
    case 'Product':
      return {
        ...baseStructuredData,
        ...data
      }
    
    case 'Service':
      return {
        ...baseStructuredData,
        ...data
      }
    
    default:
      return {
        ...baseStructuredData,
        ...data
      }
  }
}
