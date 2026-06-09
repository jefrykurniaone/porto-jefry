import { useTranslations } from 'next-intl';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_DISPLAY,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_HANDLE,
} from '@/data/contact';

export default function About() {
    const t = useTranslations('about');

    return (
        <section id='about' className='sgds:py-layout-lg sgds:bg-alternate'>
            <div className='sgds-container'>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-heading-default sgds:mb-layout-md sgds:text-center'>
                    {t('title')}
                </h2>
                <div className='sgds:flex sgds:justify-center'>
                    <sgds-card suppressHydrationWarning className='sgds:max-w-3xl'>
                        <span slot='description' className='sgds:text-body-md sgds:text-body-default sgds:leading-xs'>
                            {t('description')}
                        </span>
                        <div slot='footer' className='sgds:flex sgds:flex-wrap sgds:gap-layout-sm'>
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                aria-label={t('contact_email')}
                                className='sgds:inline-flex sgds:items-center sgds:gap-component-xs sgds:text-body-md sgds:text-link hover:sgds:text-link-hover sgds:underline'>
                                <sgds-icon name='mail' aria-hidden='true' suppressHydrationWarning />
                                <span>{CONTACT_EMAIL}</span>
                            </a>
                            <a
                                href={CONTACT_PHONE_HREF}
                                aria-label={t('contact_phone')}
                                className='sgds:inline-flex sgds:items-center sgds:gap-component-xs sgds:text-body-md sgds:text-link hover:sgds:text-link-hover sgds:underline'>
                                <sgds-icon name='phone' aria-hidden='true' suppressHydrationWarning />
                                <span>{CONTACT_PHONE_DISPLAY}</span>
                            </a>
                            <a
                                href={CONTACT_LINKEDIN_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label={t('contact_linkedin')}
                                className='sgds:inline-flex sgds:items-center sgds:gap-component-xs sgds:text-body-md sgds:text-link hover:sgds:text-link-hover sgds:underline'>
                                <LinkedInIcon size={18} aria-hidden='true' />
                                <span>{CONTACT_LINKEDIN_HANDLE}</span>
                            </a>
                        </div>
                    </sgds-card>
                </div>
            </div>
        </section>
    );
}
