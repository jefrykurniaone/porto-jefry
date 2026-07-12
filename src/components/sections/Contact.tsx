import { useTranslations } from 'next-intl';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_INTL,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY,
} from '@/data/contact';

interface ContactCardItem {
    label: string;
    href: string;
    value: string;
    isExternal: boolean;
}

function ContactCard({ label, href, value, isExternal }: Readonly<ContactCardItem>) {
    return (
        <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className='panel-card panel-card--lift contact-card'>
            <span className='contact-card__label'>{label}</span>
            <span className='contact-card__value'>{value}</span>
        </a>
    );
}

type TranslateFn = (key: string) => string;

function buildContactCards(t: TranslateFn): ContactCardItem[] {
    return [
        {
            label: t('email_label'),
            href: `mailto:${CONTACT_EMAIL}`,
            value: CONTACT_EMAIL,
            isExternal: false,
        },
        {
            label: t('phone_label'),
            href: CONTACT_PHONE_HREF,
            value: CONTACT_PHONE_INTL,
            isExternal: false,
        },
        {
            label: t('linkedin_label'),
            href: CONTACT_LINKEDIN_URL,
            value: CONTACT_LINKEDIN_DISPLAY,
            isExternal: true,
        },
    ];
}

export default function Contact() {
    const t = useTranslations('contact');
    const nav = useTranslations('nav');
    const cards = buildContactCards(t);

    return (
        <section id='contact' className='section-band'>
            <div className='contact-section-inner'>
                <p className='section-kicker'>06 / {nav('contact')}</p>
                <h2 className='contact-title'>{t('title')}</h2>
                <p className='contact-desc'>{t('description')}</p>
                <div className='contact-grid'>
                    {cards.map((card) => (
                        <ContactCard key={card.href} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
}
