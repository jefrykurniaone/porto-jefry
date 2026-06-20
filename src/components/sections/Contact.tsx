import { useTranslations } from 'next-intl';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_DISPLAY,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY,
} from '@/data/contact';

interface ContactLinkItem {
    label: string;
    href: string;
    value: string;
    icon: React.ReactNode;
    isExternal: boolean;
}

function ContactCard({
    label,
    href,
    value,
    icon,
    isExternal,
}: Readonly<ContactLinkItem>) {
    return (
        <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className='sgds:block sgds:no-underline group'>
            <sgds-card suppressHydrationWarning>
                <div slot='title' className='sgds:flex sgds:flex-col sgds:items-center sgds:gap-component-xs'>
                    <div className='sgds:text-primary'>
                        {icon}
                    </div>
                    <span className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default'>
                        {label}
                    </span>
                </div>
                <div slot='description' className='sgds:text-body-md sgds:text-muted sgds:text-center sgds:break-all'>
                    {value}
                </div>
            </sgds-card>
        </a>
    );
}

type TranslateFn = (key: string) => string;

function buildContactLinks(t: TranslateFn): ContactLinkItem[] {
    return [
        {
            label: t('email_label'),
            href: `mailto:${CONTACT_EMAIL}`,
            value: CONTACT_EMAIL,
            icon: <sgds-icon name='mail' aria-hidden='true' suppressHydrationWarning />,
            isExternal: false,
        },
        {
            label: t('phone_label'),
            href: CONTACT_PHONE_HREF,
            value: CONTACT_PHONE_DISPLAY,
            icon: <sgds-icon name='phone' aria-hidden='true' suppressHydrationWarning />,
            isExternal: false,
        },
        {
            label: t('linkedin_label'),
            href: CONTACT_LINKEDIN_URL,
            value: CONTACT_LINKEDIN_DISPLAY,
            icon: <LinkedInIcon size={24} aria-hidden='true' />,
            isExternal: true,
        },
    ];
}

export default function Contact() {
    const t = useTranslations('contact');
    const links = buildContactLinks(t);
    return (
        <section id='contact' className='sgds:py-layout-lg sgds:bg-default'>
            <div className='sgds-container sgds:text-center'>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-heading-default sgds:mb-layout-md'>
                    {t('title')}
                </h2>
                <p className='sgds:text-body-md sgds:text-muted sgds:max-w-2xl sgds:mx-auto sgds:mb-layout-md sgds:leading-xs'>
                    {t('description')}
                </p>
                <div className='sgds-grid'>
                    {links.map((link) => (
                        <div key={link.href} className='sgds-col-4 sgds-col-sm-4 sgds-col-lg-4'>
                            <ContactCard {...link} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
