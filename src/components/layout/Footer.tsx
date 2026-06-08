import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');
    const year = new Date().getFullYear();

    return (
        <footer id='site-footer' className='sgds:border-t sgds:border-divider sgds:py-layout-md sgds:text-center sgds:text-body-md sgds:text-muted'>
            <p>{t('built_with')}</p>
            <p className='sgds:mt-1'>
                &copy; {year} Jefry Kurniawan. {t('rights')}
            </p>
        </footer>
    );
}
