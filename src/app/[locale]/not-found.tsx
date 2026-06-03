'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FileQuestion 
          size={64} 
          className="mx-auto mb-6 text-gray-400 dark:text-gray-500" 
          aria-hidden="true"
        />
        <h1 className="text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('message')}
        </p>
        <Link href={`/${locale}`}>
          <button 
            type="button"
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            {t('returnHome')}
          </button>
        </Link>
      </div>
    </div>
  );
}
