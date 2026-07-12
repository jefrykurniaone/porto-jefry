import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');
    const year = new Date().getFullYear();

    return (
        <footer id='site-footer' className='site-footer'>
            <p>{t('built_with')}</p>
            <p>
                &copy; {year} Jefry Kurniawan. {t('rights')}
            </p>
        </footer>
    );
}
