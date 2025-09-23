import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import ProductDetailsPage from '@/components/pages/ProductDetailsPage'
import { generateMetadata as generateMeta, generateAlternateLanguages, generateProductJsonLd, generateJsonLd } from '@/lib/metadata'
import { fetchProductById } from '@/services'

interface Props {
  params: Promise<{ 
    locale: string
    productId: string 
  }>
}

// Prefetch product data for better SEO and faster loading
async function getProductData(productId: string) {
  try {
    const product = await fetchProductById(productId)
    return product
  } catch (error) {
    return null
  }
}

export async function generateMetadata({ params}: Props): Promise<Metadata> {
  const { locale, productId } = await params
  const product = await getProductData(productId)
  
  if (!product) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'metadata.product' })
  
  const productImage = product.imageUrl || '/images/product-placeholder.jpg'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rabet-alkhayal.com'
  
  return generateMeta({
    title: `${product.name} | ${t('titleSuffix')}`,
    description: product.description || t('defaultDescription'),
    keywords: [
      product.name,
      product.subcategory?.name,
      ...t('keywords').split(',').map(k => k.trim())
    ].filter((k): k is string => Boolean(k)),
    locale,
    ogType: 'website',
    ogImage: productImage.startsWith('http') ? productImage : `${baseUrl}${productImage}`,
    alternates: {
      languages: generateAlternateLanguages(locale, `/products/${productId}`)
    },
    product: {
      price: product.price?.toString(),
      currency: 'SAR',
      availability: product.isInStock ? 'in stock' : 'out of stock',
      brand: 'ربط الخيال',
      category: product.subcategory?.name || 'Product'
    }
  })
}

export default async function ProductPage({ params }: Props) {
  const { locale, productId } = await params
  // Create a new QueryClient for prefetching
  const queryClient = new QueryClient()

  // Prefetch product data
  await queryClient.prefetchQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    staleTime: 60 * 1000, // 1 minute
  })

  // Get product data for JSON-LD
  const product = await getProductData(productId)
  
  if (!product) {
    notFound()
  }

  // Generate JSON-LD structured data
  const productJsonLd = generateProductJsonLd(product, locale)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(productJsonLd)}
      />
      <ProductDetailsPage />
    </HydrationBoundary>
  )
}
