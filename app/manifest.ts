import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  
  return {
    name: 'Rabet Alkhayal - ربط الخيال',
    short_name: 'Rabet Alkhayal',
    description: 'منصة متكاملة للمنتجات والخدمات الإبداعية والتقنية عالية الجودة | Comprehensive platform for high-quality creative and technical products and services',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e40af',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'ar',
    dir: 'rtl',
    categories: ['business', 'productivity', 'shopping'],
    icons: [
      {
        src: '/m-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/m-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/m-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/m-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/placeholder.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
        form_factor: 'wide',
        label: 'Rabet Alkhayal Homepage'
      },
      {
        src: '/placeholder.jpg',
        sizes: '750x1334',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Rabet Alkhayal Mobile'
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400
    },
    launch_handler: {
      client_mode: 'navigate-existing'
    }
  }
}
