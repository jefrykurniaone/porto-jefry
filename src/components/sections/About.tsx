import { useTranslations } from 'next-intl';
import { MailIcon, PhoneIcon } from 'lucide-react';
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
        <section id='about' className='py-20 px-4'>
            <div className='max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center'>
                    {t('title')}
                </h2>
                <div className='bg-gray-50 dark:bg-gray-900 rounded-2xl p-8'>
                    <p className='text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8'>
                        {t('description')}
                    </p>
                    <div className='flex flex-wrap gap-6'>
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            aria-label={t('contact_email')}
                            className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                            <MailIcon size={18} aria-hidden='true' />
                            <span>{CONTACT_EMAIL}</span>
                        </a>
                        <a
                            href={CONTACT_PHONE_HREF}
                            aria-label={t('contact_phone')}
                            className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                            <PhoneIcon size={18} aria-hidden='true' />
                            <span>{CONTACT_PHONE_DISPLAY}</span>
                        </a>
                        <a
                            href={CONTACT_LINKEDIN_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={t('contact_linkedin')}
                            className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                            <LinkedInIcon size={18} aria-hidden='true' />
                            <span>{CONTACT_LINKEDIN_HANDLE}</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
