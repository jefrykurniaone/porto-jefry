import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');
    const year = new Date().getFullYear();

    return (
        <footer className='border-t border-gray-100 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
            <p>{t('built_with')}</p>
            <p className='mt-1'>
                © {year} Jefry Kurniawan. {t('rights')}
            </p>
        </footer>
    );
}
