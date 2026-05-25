import { useTranslations } from 'next-intl';
import { Github, MailIcon, PhoneIcon } from 'lucide-react';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_DISPLAY,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY,
    CONTACT_GITHUB_URL,
    CONTACT_GITHUB_DISPLAY,
} from '@/data/contact';

interface ContactLinkItem {
    label: string;
    href: string;
    value: string;
    icon: React.ReactNode;
    isExternal: boolean;
}

function ContactCard({ label, href, value, icon, isExternal }: Readonly<ContactLinkItem>) {
    return (
        <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className='flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 group'>
            <span className='p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform'>
                {icon}
            </span>
            <span className='font-medium text-gray-900 dark:text-white text-sm'>{label}</span>
            <span className='text-xs text-gray-500 dark:text-gray-400 break-all'>{value}</span>
        </a>
    );
}

export default function Contact() {
    const t = useTranslations('contact');

    const links: ContactLinkItem[] = [
        {
            label: t('email_label'),
            href: `mailto:${CONTACT_EMAIL}`,
            value: CONTACT_EMAIL,
            icon: <MailIcon size={20} aria-hidden='true' />,
            isExternal: false,
        },
        {
            label: t('phone_label'),
            href: CONTACT_PHONE_HREF,
            value: CONTACT_PHONE_DISPLAY,
            icon: <PhoneIcon size={20} aria-hidden='true' />,
            isExternal: false,
        },
        {
            label: t('linkedin_label'),
            href: CONTACT_LINKEDIN_URL,
            value: CONTACT_LINKEDIN_DISPLAY,
            icon: <LinkedInIcon size={20} aria-hidden='true' />,
            isExternal: true,
        },
        {
            label: t('github_label'),
            href: CONTACT_GITHUB_URL,
            value: CONTACT_GITHUB_DISPLAY,
            icon: <Github size={20} aria-hidden='true' />,
            isExternal: true,
        },
    ];

    return (
        <section id='contact' className='py-20 px-4'>
            <div className='max-w-4xl mx-auto text-center'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                    {t('title')}
                </h2>
                <p className='text-gray-600 dark:text-gray-300 text-lg mb-12 max-w-2xl mx-auto'>
                    {t('description')}
                </p>
                <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {links.map((link) => (
                        <ContactCard key={link.href} {...link} />
                    ))}
                </div>
            </div>
        </section>
    );
}
