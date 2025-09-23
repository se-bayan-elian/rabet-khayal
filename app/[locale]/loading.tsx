"use client";

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Package, ShoppingBag } from 'lucide-react';

export default function Loading() {
  const t = useTranslations('loading');
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4" dir={dir}>
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Loading Animation */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Loader2 className="w-12 h-12 text-blue-500 dark:text-blue-400 animate-spin" />
              </div>
              
              {/* Floating Icons */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center animate-bounce">
                <Package className="w-4 h-4" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Loading Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {t('title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('message')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>

          {/* Loading Tips */}
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>{t('tip1')}</p>
            <p>{t('tip2')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
