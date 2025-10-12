import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import CategoryDetailPage from '@/components/pages/CategoryDetailPage'
import { generateMetadata as generateMeta, generateAlternateLanguages } from '@/lib/metadata'
import { fetchCategoryById } from '@/services'

interface Props {
  params: Promise<{ 
    locale: string
    categoryId: string 
  }>
}

// Prefetch category data for better SEO and faster loading
async function getCategoryData(categoryId: string) {
  try {
    const category = await fetchCategoryById(categoryId)
    return category
  } catch (error) {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categoryId } = await params
  const category = await getCategoryData(categoryId)
  
  if (!category) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'metadata.category' })
  
  const categoryImage = category.imageUrl || '/images/category-placeholder.jpg'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  
  return generateMeta({
    title: `${category.name} | ${t('titleSuffix')}`,
    description: category.description || t('defaultDescription'),
    keywords: [
      category.name,
      ...t('keywords').split(',').map(k => k.trim())
    ].filter((k): k is string => Boolean(k)),
    locale,
    ogType: 'website',
    ogImage: categoryImage.startsWith('http') ? categoryImage : `${baseUrl}${categoryImage}`,
    alternates: {
      languages: generateAlternateLanguages(locale, `/categories/${categoryId}`)
    }
  })
}

export default async function CategoryPage({ params }: Props) {
  const { locale, categoryId } = await params
  
  // Create a new QueryClient for prefetching
  const queryClient = new QueryClient()

  // Prefetch category data
  await queryClient.prefetchQuery({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    staleTime: 60 * 1000, // 1 minute
  })

  // Get category data to check if it exists
  const category = await getCategoryData(categoryId)
  
  if (!category) {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryDetailPage />
    </HydrationBoundary>
  )
}

