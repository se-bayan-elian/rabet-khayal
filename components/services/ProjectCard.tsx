import { ArrowLeft, ArrowRight, ExternalLink, Calendar, User } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Project } from '@/types/services'
import { useTranslations } from 'next-intl'

type ProjectCardProps = {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const t = useTranslations('services.detail')

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.mainImageUrl || '/placeholder-project.jpg'}
          alt={project.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 brand-heading line-clamp-1">{project.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

        <div className="space-y-2 mb-4 text-sm text-gray-500">
          {project.clientName && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{project.clientName}</span>
            </div>
          )}
          {project.completionDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.completionDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {project.projectUrl && (
            <Link
              href={project.projectUrl}
              target="_blank"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              {t('viewLive')}
            </Link>
          )}
          <Link href={`/services/projects/${project.id}`}>
            <Button variant="ghost" size="sm" className="group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform">
              {t('viewProject')}
              <ArrowRight className="w-4 h-4 ml-2 rtl:hidden" />
              <ArrowLeft className="w-4 h-4 mr-2 ltr:hidden" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
