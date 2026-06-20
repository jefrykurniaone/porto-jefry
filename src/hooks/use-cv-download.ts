'use client';

import { useState } from 'react';

interface UseCvDownloadReturn {
    isDownloading: boolean;
    errorMessage: string | null;
    handleDownload: () => Promise<void>;
}

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

export function useCvDownload(locale: string, t: TranslateFn): UseCvDownloadReturn {
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        setErrorMessage(null);
        try {
            const res = await fetch(`/api/generate-cv?${new URLSearchParams({ locale })}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Jefry_Kurniawan_CV.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            const statusMatch = err instanceof Error ? err.message.match(/HTTP (\d+)/) : null;
            const status = statusMatch ? statusMatch[1] : 'unknown';
            setErrorMessage(t('cv_error', { status }));
            setTimeout(() => setErrorMessage(null), 5000);
            // eslint-disable-next-line no-console
            console.error('[CV Download] failed:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return { isDownloading, errorMessage, handleDownload };
}
