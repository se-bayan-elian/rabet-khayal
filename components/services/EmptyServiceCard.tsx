import { Home, Inbox, RotateCw } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const EmptyServiceCard = () => {
  const router = useRouter();
  const t = useTranslations('services')
  return (
    <div className="col-span-full flex justify-center py-12 px-4">
      <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gray-100 dark:bg-gray-700">
          <Inbox className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
          {t('noServices.title')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('noServices.message')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.refresh()}
            className="flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            {t('noServices.refresh')}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('noServices.goHome')}
          </Button>
        </div>
      </div>
    </div>)
}

export default EmptyServiceCard