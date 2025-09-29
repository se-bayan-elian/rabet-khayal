import SubcategoryPage from '@/components/pages/SubCategoryPage'
import { fetchSubcategoryById } from '@/services'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    categoryId: string
    subcategoryId: string
    locale: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const subcategory = await fetchSubcategoryById(params.subcategoryId)
    
    if (!subcategory) {
      return {
        title: 'Subcategory Not Found',
        description: 'The requested subcategory could not be found.'
      }
    }

    const isArabic = params.locale === 'ar'
    const title = `${subcategory.name} | Rabet Alkhayal`
    const description = `Browse ${subcategory.name} products - High quality products from Rabet Alkhayal`

    return {
      title,
      description,
      keywords: isArabic 
        ? `منتجات ${subcategory.name}, ربط الخيال, منتجات عالية الجودة`
        : `${subcategory.name} products, Rabet Alkhayal, high quality products`,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: isArabic ? 'ar_SA' : 'en_US',
        url: `https://rabet-alkhayal.com/${params.locale}/categories/${params.categoryId}/sub/${params.subcategoryId}`,
        siteName: 'Rabet Alkhayal',
        images: subcategory.imageUrl ? [
          {
            url: subcategory.imageUrl,
            width: 1200,
            height: 630,
            alt: subcategory.name,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: subcategory.imageUrl ? [subcategory.imageUrl] : [],
      },
      alternates: {
        canonical: `https://rabet-alkhayal.com/${params.locale}/categories/${params.categoryId}/sub/${params.subcategoryId}`,
        languages: {
          'en': `https://rabet-alkhayal.com/en/categories/${params.categoryId}/sub/${params.subcategoryId}`,
          'ar': `https://rabet-alkhayal.com/ar/categories/${params.categoryId}/sub/${params.subcategoryId}`,
        },
      },
    }
  } catch (error) {
    return {
      title: 'Subcategory Not Found',
      description: 'The requested subcategory could not be found.'
    }
  }
}

export default async function page({ params }: PageProps) {
  try {
    // Prefetch the subcategory data
    const subcategory = await fetchSubcategoryById(params.subcategoryId)
    
    if (!subcategory) {
      notFound()
    }

    return <SubcategoryPage />
  } catch (error) {
    notFound()
  }
}