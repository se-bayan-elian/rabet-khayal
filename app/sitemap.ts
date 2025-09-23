import { MetadataRoute } from 'next'
import { getTranslations } from 'next-intl/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  
  // Get all supported locales
  const locales = ['ar', 'en']
  
  // Static pages that exist for all locales
  const staticPages = [
    '',
    '/products',
    '/services',
    '/categories',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
    '/login',
    '/register',
    '/verify-otp',
    '/cart',
    '/wishlist',
    '/my-orders',
    '/my-profile'
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Generate sitemap entries for each locale and page combination
  for (const locale of locales) {
    for (const page of staticPages) {
      const url = page === '' ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}${page}`
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [
              loc,
              `${baseUrl}/${loc}${page === '' ? '' : page}`
            ])
          )
        }
      })
    }
  }

  // Add dynamic product pages (you might want to fetch these from your API)
  // This is a placeholder - you should replace with actual product data
  const productPages = [
    '/products/1',
    '/products/2',
    '/products/3',
    // Add more product IDs as needed
  ]

  for (const locale of locales) {
    for (const productPage of productPages) {
      const url = `${baseUrl}/${locale}${productPage}`
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [
              loc,
              `${baseUrl}/${loc}${productPage}`
            ])
          )
        }
      })
    }
  }

  // Add dynamic service pages
  const servicePages = [
    '/services/1',
    '/services/2',
    '/services/3',
    // Add more service IDs as needed
  ]

  for (const locale of locales) {
    for (const servicePage of servicePages) {
      const url = `${baseUrl}/${locale}${servicePage}`
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [
              loc,
              `${baseUrl}/${loc}${servicePage}`
            ])
          )
        }
      })
    }
  }

  // Add category and subcategory pages
  const categoryPages = [
    '/categories/1',
    '/categories/2',
    '/categories/3',
    // Add more category IDs as needed
  ]

  for (const locale of locales) {
    for (const categoryPage of categoryPages) {
      const url = `${baseUrl}/${locale}${categoryPage}`
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [
              loc,
              `${baseUrl}/${loc}${categoryPage}`
            ])
          )
        }
      })
    }
  }

  return sitemap
}
