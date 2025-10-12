"use client";

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft, FileQuestion, Compass, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const t = useTranslations('errors');
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 py-24">
      <div className="w-full max-w-3xl mx-auto">
        {/* Animated 404 Background */}
        <div className="relative">
          {/* Floating decoration elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-gold/10 dark:bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-navy/10 dark:bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12">
            {/* 404 Visual */}
            <div className="mb-8 text-center">
              <div className="relative inline-block">
                {/* Large 404 Text */}
                <div className="text-[120px] md:text-[180px] font-black leading-none">
                  <span className="bg-gradient-to-r from-brand-gold via-brand-navy to-brand-gold dark:from-amber-400 dark:via-amber-500 dark:to-amber-400 bg-clip-text text-transparent">
                    404
                  </span>
                </div>
                
                {/* Icon overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl border-4 border-brand-gold/20 dark:border-amber-400/20">
                    <FileQuestion className="w-10 h-10 md:w-12 md:h-12 text-brand-navy dark:text-amber-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('notFound.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-3 max-w-xl mx-auto">
                {t('notFound.message')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {t('notFound.suggestion')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex items-center justify-center gap-2 px-6 py-6 text-base border-gray-300 dark:border-gray-600 hover:border-brand-gold dark:hover:border-amber-400 hover:bg-brand-gold/5 dark:hover:bg-amber-400/5 text-gray-700 dark:text-gray-300 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('notFound.goBack')}
              </Button>
              
              <Link href={`/${locale}`}>
                <Button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-6 text-base bg-gradient-to-r from-brand-navy to-brand-navy-light dark:from-amber-600 dark:to-amber-500 hover:from-brand-navy-light hover:to-brand-navy dark:hover:from-amber-500 dark:hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all">
                  <Home className="w-5 h-5" />
                  {t('notFound.goHome')}
                </Button>
              </Link>
              
              <Link href={`/${locale}/categories`}>
                <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-6 text-base border-gray-300 dark:border-gray-600 hover:border-brand-gold dark:hover:border-amber-400 hover:bg-brand-gold/5 dark:hover:bg-amber-400/5 text-gray-700 dark:text-gray-300 transition-all">
                  <Package className="w-5 h-5" />
                  {t('notFound.browseProducts')}
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 font-medium">
                {locale === 'ar' ? 'أو جرّب هذه الروابط السريعة:' : 'Or try these quick links:'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href={`/${locale}/services`}>
                  <button className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-brand-gold/20 dark:hover:bg-amber-400/20 text-gray-700 dark:text-gray-300 hover:text-brand-navy dark:hover:text-amber-400 transition-all border border-transparent hover:border-brand-gold/30 dark:hover:border-amber-400/30">
                    <Compass className="w-4 h-4 inline mr-2" />
                    {locale === 'ar' ? 'الخدمات' : 'Services'}
                  </button>
                </Link>
                <Link href={`/${locale}/about`}>
                  <button className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-brand-gold/20 dark:hover:bg-amber-400/20 text-gray-700 dark:text-gray-300 hover:text-brand-navy dark:hover:text-amber-400 transition-all border border-transparent hover:border-brand-gold/30 dark:hover:border-amber-400/30">
                    {locale === 'ar' ? 'من نحن' : 'About Us'}
                  </button>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <button className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-brand-gold/20 dark:hover:bg-amber-400/20 text-gray-700 dark:text-gray-300 hover:text-brand-navy dark:hover:text-amber-400 transition-all border border-transparent hover:border-brand-gold/30 dark:hover:border-amber-400/30">
                    {locale === 'ar' ? 'اتصل بنا' : 'Contact'}
                  </button>
                </Link>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-brand-gold/10 dark:bg-amber-400/10 rounded-xl border border-brand-gold/20 dark:border-amber-400/20">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                <span className="font-semibold text-brand-navy dark:text-amber-400">💡 </span>
                {t('notFound.helpText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
