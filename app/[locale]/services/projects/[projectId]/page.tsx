import ProjectDetailPage from '@/components/pages/ProjectDetailsPage'
import { fetchProjectById } from '@/services/services'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    projectId: string
    locale: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const project = await fetchProjectById(params.projectId)
    
    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.'
      }
    }

    const isArabic = params.locale === 'ar'
    const title = `${project.title} | Rabet Alkhayal`
    const description = project.description?.replace(/<[^>]*>/g, '').substring(0, 160) || 
      `${project.title} - Professional project from Rabet Alkhayal`

    return {
      title,
      description,
      keywords: isArabic 
        ? `مشروع ${project.title}, ربط الخيال, مشاريع احترافية`
        : `${project.title} project, Rabet Alkhayal, professional projects`,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: isArabic ? 'ar_SA' : 'en_US',
        url: `https://rabet-alkhayal.com/${params.locale}/services/projects/${params.projectId}`,
        siteName: 'Rabet Alkhayal',
        images: project.mainImageUrl ? [
          {
            url: project.mainImageUrl,
            width: 1200,
            height: 630,
            alt: project.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: project.mainImageUrl ? [project.mainImageUrl] : [],
      },
      alternates: {
        canonical: `https://rabet-alkhayal.com/${params.locale}/services/projects/${params.projectId}`,
        languages: {
          'en': `https://rabet-alkhayal.com/en/services/projects/${params.projectId}`,
          'ar': `https://rabet-alkhayal.com/ar/services/projects/${params.projectId}`,
        },
      },
    }
  } catch (error) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    }
  }
}

export default async function page({ params }: PageProps) {
  try {
    // Prefetch the project data
    const project = await fetchProjectById(params.projectId)
    
    if (!project) {
      notFound()
    }

    return <ProjectDetailPage />
  } catch (error) {
    notFound()
  }
}