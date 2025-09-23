"use client";

import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, RefreshCw, AlertCircle, Bug } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('errors');
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';


  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bug className="w-16 h-16 text-red-500 dark:text-red-400" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              {t('error.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {t('error.message')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('error.suggestion')}
            </p>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Error Details:</h3>
              <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <RefreshCw className="w-4 h-4" />
              {t('error.tryAgain')}
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 px-6 py-3">
                <Home className="w-4 h-4" />
                {t('error.goHome')}
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2" dir={dir}>
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-700 dark:text-red-400">{t('error.helpTitle')}</h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">
              {t('error.helpText')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
