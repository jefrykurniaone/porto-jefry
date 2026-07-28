'use client';

import { useEffect, useRef, useState } from 'react';
import { cvFileName } from '@/utils/cv';

const SUCCESS_VISIBLE_MS = 8000;

interface UseCvDownloadReturn {
    isDownloading: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    handleDownload: () => Promise<void>;
}

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

function formatSize(bytes: number): string {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function fetchCvBlob(locale: string): Promise<Blob> {
    const res = await fetch(`/api/generate-cv?${new URLSearchParams({ locale })}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.blob();
}

function saveBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    // Deferred: revoking synchronously after click() can cancel the download in
    // Firefox and Safari, which read the blob URL on a later tick than Chromium.
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * 429 is the route's own rate limit (5 req/IP/60s), which a visitor can trip
 * just by switching locale and downloading twice. Reporting that as a generic
 * failure made a working site look broken, so it gets its own message.
 */
function messageKeyFor(err: unknown): { key: string; status: string } {
    const match = err instanceof Error ? err.message.match(/HTTP (\d+)/) : null;
    const status = match ? match[1] : 'unknown';
    return { key: status === '429' ? 'error_rate_limit' : 'error', status };
}

interface RunDownloadArgs {
    locale: string;
    t: TranslateFn;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

async function runDownload({ locale, t, onSuccess, onError }: RunDownloadArgs) {
    try {
        const blob = await fetchCvBlob(locale);
        const fileName = cvFileName(locale);
        saveBlob(blob, fileName);
        onSuccess(
            t('success', {
                filename: fileName,
                size: formatSize(blob.size),
                language: t('language_name'),
            }),
        );
    } catch (err) {
        const { key, status } = messageKeyFor(err);
        onError(t(key, { status }));
        console.error('[CV Download] failed:', err);
    }
}

/**
 * Success auto-clears after eight seconds; failure does not. The error is the
 * only diagnostic this page ever produces, and the old five-second dismissal
 * lost it to anyone who glanced away — it now clears on the next attempt.
 *
 * The cleanup effect never calls setState, so `react-hooks/set-state-in-effect`
 * stays satisfied. It exists because the drawer unmounts on close while a
 * dismissal timer may still be pending.
 */
export function useCvDownload(locale: string, t: TranslateFn): UseCvDownloadReturn {
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setSuccessMessage(null), SUCCESS_VISIBLE_MS);
    };

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        await runDownload({ locale, t, onSuccess: showSuccess, onError: setErrorMessage });
        setIsDownloading(false);
    };

    return { isDownloading, errorMessage, successMessage, handleDownload };
}
