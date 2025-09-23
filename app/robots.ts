import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/auth/',
          '/my-orders/',
          '/my-profile/',
          '/cart/',
          '/wishlist/',
          '/verify-otp/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/auth/',
          '/my-orders/',
          '/my-profile/',
          '/cart/',
          '/wishlist/',
          '/verify-otp/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/auth/',
          '/my-orders/',
          '/my-profile/',
          '/cart/',
          '/wishlist/',
          '/verify-otp/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
