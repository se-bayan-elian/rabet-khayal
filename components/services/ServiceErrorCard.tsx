import { AlertTriangle, Home, RotateCw } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
type ServiceErrorCardProps = {
  error: Error | null
}
const ServiceErrorCard = ({ error }: ServiceErrorCardProps) => {
  const router = useRouter();
  const t = useTranslations('services')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
          {t('error.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('error.message')}
          {error instanceof Error && (
            <span className="block mt-2 text-sm text-red-500">
              {error.message}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.refresh()}
            className="flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            {t('error.retry')}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('error.goHome')}
          </Button>
        </div>
      </div>
    </div>)
}

export default ServiceErrorCard