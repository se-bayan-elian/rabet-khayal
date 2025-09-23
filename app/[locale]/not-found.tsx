"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const t = useTranslations('errors');
  const router = useRouter();

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {t('notFound.title')}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {t('notFound.message')}
            </p>
            <p className="text-sm text-gray-500">
              {t('notFound.suggestion')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('notFound.goBack')}
            </Button>
            
            <Link href="/">
              <Button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Home className="w-4 h-4" />
                {t('notFound.goHome')}
              </Button>
            </Link>
            
            <Link href="/products">
              <Button variant="outline" className="flex items-center gap-2 px-6 py-3">
                <Search className="w-4 h-4" />
                {t('notFound.browseProducts')}
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {t('notFound.helpText')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
