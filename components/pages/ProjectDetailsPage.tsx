"use client"

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, User, ImageIcon, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from 'next/navigation'
import { fetchProjectById } from '@/services/services'
import { Project } from '@/types/services'
import { useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function ProjectDetailPage() {

  const t = useTranslations('services.project')
  const params = useParams<any>();
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Fetch project details
  const {
    data: project,
    isLoading,
    isError
  } = useQuery<Project>({
    queryKey: ['project', params.projectId],
    queryFn: () => fetchProjectById(params.projectId),
    staleTime: 5000,
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-20">
        <div className="section-padding">
          <div className="section-container">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !project) {
    return (
      <div className="pt-20">
        <div className="section-padding">
          <div className="section-container">
            <Card className="p-8 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent>
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500 dark:text-yellow-400" />
                <h3 className="text-xl font-bold mb-2 dark:text-white">{t('notFound')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t('notFoundDescription')}</p>
                <Button onClick={() => router.back()}>
                  {t('goBack')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }



  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleNextImage = () => {
    if (selectedImageIndex !== null && project?.gallery && selectedImageIndex < project.gallery.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="section-padding bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800" style={{ background: 'var(--brand-bg)' }}>
        <div className="section-container">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 hover:bg-secondary hover:text-white dark:hover:bg-gray-700 dark:text-gray-300">
              <ArrowLeft className="w-4 h-4 rtl:hidden" />
              <ArrowRight className="w-4 h-4 ltr:hidden" />
              {t('back')}
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 ">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 brand-heading dark:text-white">{project.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: project.description || "" }}
              ></p>

              <div className="space-y-4 mb-8">
                {project.clientName && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('client')}: {project.clientName}</span>
                  </div>
                )}
                {project.completionDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {t('completed')}: {new Date(project.completionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {project.service && (
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full" style={{ background: 'var(--brand-gold)' }}></span>
                    <span className="text-gray-700 dark:text-gray-300">{t('service')}: {project.service.name}</span>
                  </div>
                )}
              </div>

              {project.projectUrl && (
                <a href={project.projectUrl} target="_blank" className="flex items-center gap-2  w-fit btn-primary">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('viewLive')}
                </a>
              )}
            </div>

            {project.mainImageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={project.mainImageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project?.gallery && project?.gallery?.length > 0 && (
        <section className="section-padding">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4 brand-heading dark:text-white">{t('gallery')}</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('galleryDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
              {project?.gallery.map((image, index) => (image?.url || (typeof image === 'string' && image)) && (
                <div
                  key={image.public_id ?? `${project.id}-gallery-${index}`}
                  className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={image?.url ?? image.toString()}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Service */}
      {project.service && (
        <section className="section-padding border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800" style={{ background: 'var(--brand-bg)' }}>
          <div className="section-container">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 brand-heading dark:text-white">{t('relatedService')}</h2>
            </div>

            <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/50">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-4 brand-heading dark:text-white">{project.service.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{project.service.description}</p>
                <Link href={`/services/${project.service.id}`} className="btn-primary">
                    {t('viewService')}
                    <ArrowRight className="w-4 h-4 ml-2 rtl:hidden" />
                    <ArrowLeft className="w-4 h-4 mr-2 ltr:hidden" />
                  </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedImageIndex !== null && project?.gallery && (
            <div className="relative">
              <div className="relative aspect-video">
                <Image
                  src={project.gallery[selectedImageIndex]?.url ?? project.gallery[selectedImageIndex]}
                  alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Navigation arrows */}
              {project.gallery.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={handlePrevImage}
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={handleNextImage}
                    disabled={selectedImageIndex === project.gallery.length - 1}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {project.gallery.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
