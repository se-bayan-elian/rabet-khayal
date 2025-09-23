import { Metadata } from 'next'

interface GenerateMetadataOptions {
  title: string
  description: string
  keywords?: string[]
  locale: string
  ogType?: string
  ogImage?: string
  alternates?: {
    languages: Record<string, string>
  }
  product?: {
    price?: string
    currency?: string
    availability?: string
    brand?: string
    category?: string
  }
}

export function generateMetadata(options: GenerateMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    locale,
    ogType = 'website',
    ogImage,
    alternates,
    product
  } = options

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  const canonicalUrl = `${baseUrl}/${locale}`

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: alternates?.languages || {}
    },
    openGraph: {
      title,
      description,
      type: ogType as any,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      url: canonicalUrl,
      siteName: 'Rabet Alkhayal',
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined
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
    }
  }

  // Add product-specific metadata
  if (product && ogType === 'product') {
    metadata.other = {
      'product:price:amount': product.price || '',
      'product:price:currency': product.currency || 'SAR',
      'product:availability': product.availability || 'in stock',
      'product:brand': product.brand || 'Rabet Alkhayal',
      'product:category': product.category || ''
    }
  }

  return metadata
}

export function generateAlternateLanguages(currentLocale: string, path: string): Record<string, string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  const locales = ['en', 'ar']
  
  const alternates: Record<string, string> = {}
  
  locales.forEach(locale => {
    if (locale !== currentLocale) {
      alternates[locale] = `${baseUrl}/${locale}${path}`
    }
  })
  
  return alternates
}

export function generateProductJsonLd(product: any, locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  const productUrl = `${baseUrl}/${locale}/products/${product.id}`
  const productImage = product.imageUrl || `${baseUrl}/images/product-placeholder.jpg`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: productImage,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'Rabet Alkhayal'
    },
    category: product.subcategory?.name || product.category?.name,
    offers: {
      '@type': 'Offer',
      price: product.discountedPrice || product.originalPrice || product.price,
      priceCurrency: 'SAR',
      availability: product.isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Rabet Alkhayal'
      }
    },
    aggregateRating: product.averageRating ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount || 0
    } : undefined
  }
}

export function generateJsonLd(data: any) {
  return {
    __html: JSON.stringify(data, null, 2)
  }
}
