'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCvDownload } from '@/hooks/use-cv-download';

interface CvDownloadActionProps {
    /** Button class — `btn-primary` closing the contact section, `btn-outline` in the drawer. */
    buttonClassName: string;
    /** Wrapper class, so each surface owns its own spacing. */
    className: string;
}

/**
 * The CV action everywhere except the hero, which keeps its own instance so the
 * notices can sit outside the `.hero__ctas` flex row. The request logic lives in
 * `useCvDownload`; only the framing differs per surface. Each instance holds its
 * own state on purpose — a failure in the drawer should not blank the one in the
 * contact section.
 */
export default function CvDownloadAction({
    buttonClassName,
    className,
}: Readonly<CvDownloadActionProps>) {
    const t = useTranslations('cv');
    const locale = useLocale();
    const { isDownloading, errorMessage, successMessage, handleDownload } =
        useCvDownload(locale, t);

    return (
        <div className={className}>
            <button
                type='button'
                onClick={handleDownload}
                disabled={isDownloading}
                className={buttonClassName}>
                {isDownloading ? t('generating') : t('download')}
            </button>
            {errorMessage && (
                <p role='alert' className='notice notice--fault'>{errorMessage}</p>
            )}
            {/* role='status' rather than 'alert': a confirmation is polite news,
                and an assertive live region would interrupt a screen reader
                mid-sentence to announce a file the user just asked for. */}
            {successMessage && (
                <p role='status' className='notice notice--ok'>{successMessage}</p>
            )}
        </div>
    );
}
