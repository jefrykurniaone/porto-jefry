'use client';

import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('error');
  const locale = useLocale();

  useEffect(() => {
    // Log error to console for debugging (not exposed to user)
    // eslint-disable-next-line no-console
    console.error('[Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle 
          size={64} 
          className="mx-auto mb-6 text-yellow-500 dark:text-yellow-400" 
          aria-hidden="true"
        />
        <h1 className="text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('message')}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            {t('tryAgain')}
          </button>
          <Link href={`/${locale}`}>
            <button
              type="button"
              className="px-6 py-4 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold rounded-xl transition-colors"
            >
              {t('returnHome')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
