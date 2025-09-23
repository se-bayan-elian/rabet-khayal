import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  
  // Get all supported locales
  const locales = ['ar', 'en']
  
  // Static pages that exist for all locales (excluding private pages)
  const staticPages = [
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'daily' as const,
    },
    {
      path: '/products',
      priority: 0.9,
      changeFrequency: 'daily' as const,
    },
    {
      path: '/services',
      priority: 0.9,
      changeFrequency: 'daily' as const,
    },
    {
      path: '/categories',
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    {
      path: '/about',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/contact',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/privacy-policy',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
    },
    {
      path: '/terms-and-conditions',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
    },
    {
      path: '/cookie-policy',
      priority: 0.3,
      changeFrequency: 'yearly' as const,
    },
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Generate sitemap entries for each locale and page combination
  for (const locale of locales) {
    for (const page of staticPages) {
      const url = page.path === '' ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}${page.path}`
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [
              loc,
              `${baseUrl}/${loc}${page.path === '' ? '' : page.path}`
            ])
          )
        }
      })
    }
  }

  // Try to fetch dynamic content from API
  try {
    // Fetch products from API
    const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products?limit=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json()
      const products = productsData.data || []
      
      for (const locale of locales) {
        for (const product of products) {
          const url = `${baseUrl}/${locale}/products/${product.id}`
          
          sitemap.push({
            url,
            lastModified: new Date(product.updatedAt || product.createdAt),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                locales.map(loc => [
                  loc,
                  `${baseUrl}/${loc}/products/${product.id}`
                ])
              )
            }
          })
        }
      }
    }
  } catch (error) {
    console.warn('Failed to fetch products for sitemap:', error)
  }

  try {
    // Fetch services from API
    const servicesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/services?limit=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (servicesResponse.ok) {
      const servicesData = await servicesResponse.json()
      const services = servicesData.data || []
      
      for (const locale of locales) {
        for (const service of services) {
          const url = `${baseUrl}/${locale}/services/${service.id}`
          
          sitemap.push({
            url,
            lastModified: new Date(service.updatedAt || service.createdAt),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                locales.map(loc => [
                  loc,
                  `${baseUrl}/${loc}/services/${service.id}`
                ])
              )
            }
          })
        }
      }
    }
  } catch (error) {
    console.warn('Failed to fetch services for sitemap:', error)
  }

  try {
    // Fetch categories from API
    const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/categories?limit=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json()
      const categories = categoriesData.data || []
      
      for (const locale of locales) {
        for (const category of categories) {
          const url = `${baseUrl}/${locale}/categories/${category.id}`
          
          sitemap.push({
            url,
            lastModified: new Date(category.updatedAt || category.createdAt),
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates: {
              languages: Object.fromEntries(
                locales.map(loc => [
                  loc,
                  `${baseUrl}/${loc}/categories/${category.id}`
                ])
              )
            }
          })

          // Add subcategories if they exist
          if (category.subcategories && category.subcategories.length > 0) {
            for (const subcategory of category.subcategories) {
              const subcategoryUrl = `${baseUrl}/${locale}/categories/${category.id}/sub/${subcategory.id}`
              
              sitemap.push({
                url: subcategoryUrl,
                lastModified: new Date(subcategory.updatedAt || subcategory.createdAt),
                changeFrequency: 'weekly',
                priority: 0.5,
                alternates: {
                  languages: Object.fromEntries(
                    locales.map(loc => [
                      loc,
                      `${baseUrl}/${loc}/categories/${category.id}/sub/${subcategory.id}`
                    ])
                  )
                }
              })
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to fetch categories for sitemap:', error)
  }

  try {
    // Fetch service projects from API
    const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/services/projects?limit=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json()
      const projects = projectsData.data || []
      
      for (const locale of locales) {
        for (const project of projects) {
          const url = `${baseUrl}/${locale}/services/projects/${project.id}`
          
          sitemap.push({
            url,
            lastModified: new Date(project.updatedAt || project.createdAt),
            changeFrequency: 'monthly',
            priority: 0.5,
            alternates: {
              languages: Object.fromEntries(
                locales.map(loc => [
                  loc,
                  `${baseUrl}/${loc}/services/projects/${project.id}`
                ])
              )
            }
          })
        }
      }
    }
  } catch (error) {
    console.warn('Failed to fetch service projects for sitemap:', error)
  }

  return sitemap
}
