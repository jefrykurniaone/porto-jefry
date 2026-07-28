import { useTranslations } from 'next-intl';

/**
 * The copyright is not the closing thought. Legal boilerplate was the last thing
 * on a page whose whole job is to read as a person worth hiring, so it moves up
 * and the human line closes.
 */
export default function Footer() {
    const t = useTranslations('footer');
    const year = new Date().getFullYear();

    return (
        <footer id='site-footer' className='site-footer'>
            <p className='site-footer__prompt'>
                <span aria-hidden='true'>$</span> exit
            </p>
            <p>
                &copy; {year} Jefry Kurniawan. {t('rights')}
            </p>
            <p>{t('built_with')}</p>
        </footer>
    );
}
